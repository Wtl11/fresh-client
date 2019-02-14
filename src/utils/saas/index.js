import {platform} from './platform'
import {retuan} from './retuan'

// 所有应用配置
let merchants = {
  platform,
  retuan
}
const application = process.applications || 'platform'
export const corp = merchants[application]
