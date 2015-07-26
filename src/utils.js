const utils = {}

utils.callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

utils.throw = (err) => {
  utils.callAsync(() => { throw err })
}

export default utils
