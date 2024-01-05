import osmosis from './osmosis'
import sei from './sei'
import unknown from './unknown'

export default function getTemplate(chain: string) {
  if (chain == 'sei') {
    return sei
  } else if (chain == 'osmosis') {
    return osmosis
  }
  return unknown
}
