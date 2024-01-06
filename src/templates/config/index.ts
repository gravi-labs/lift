import osmosis from './osmosis.js'
import sei from './sei.js'
import unknown from './unknown.js'

export default function getTemplate(chain: string) {
  if (chain == 'sei') {
    return sei
  } else if (chain == 'osmosis') {
    return osmosis
  }
  return unknown
}
