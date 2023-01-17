export const modernizeName = (name = '') => {
  if (name === "ATM")
    return "Credit Card"

  if (name.startsWith('Wallet'))
    return name.replace('Wallet', '').replace('Lux', 'Coin')

  return name
}
