// 12_media.js

import { Deploy } from '@zoolabs/contracts/utils/deploy'

export default Deploy('Media', {dependencies: ['Market']}, async({ deploy }) => {
  await deploy(['Animal', 'ANML'])
})
