import { ChainId } from '@luxdefi/sdk'

export const sortData = (data: Array<any>, byType: string) => {
  return data.sort((a, b) => Number(b.tokenID) - Number(a.tokenID))
}
export const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export const waitOnHardhat = (chainId: ChainId, timeout) => {
  return new Promise((resolve) => {
    if ([ChainId.HARDHAT, ChainId.HARDHAT2].includes(chainId)) {
      setTimeout(resolve, timeout)
    } else {
      resolve(undefined)
    }
  })
}

export const timer = (countDownDate) => {
  // Update the count down every 1 second
  const x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = countDownDate - now

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24))
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x)
      document.getElementById('demo').innerHTML = 'EXPIRED'
    }
    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '
  }, 1000)
}

export const accountEllipsis = (account) => `${account.substring(0, 6)}...${account.substring(account.length - 4)}`

export const getEmoji = (rarity) => {
  switch (rarity) {
    case 'Common':
      return '🌕'
    case 'Uncommon':
      return '🌓'
    case 'Rare':
      return '🔥'
    case 'Super Rare':
      return '☄️'
    case 'Epic':
      return '🌟'
    default:
      return ''
  }
}

export const formatError = (err) => {
  if (err?.data?.message) {
    return err?.data?.message?.replace(/Error: Returned error: /, '')
  } else if (err.code) {
    return err.message
  } else {
    return err.toString().replace(/Error: Returned error: /, '')
  }
}
