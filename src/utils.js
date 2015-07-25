const utils = {}

utils.callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

export default utils
