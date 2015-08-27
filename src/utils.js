const utils = {}

utils.callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

utils.throw = (err) => {
  utils.callAsync(() => { throw err })
}

utils.entries = function * (obj) {
  for (const key of Object.keys(obj)) {
    yield [ key, obj[key] ]
  }
}

export default utils
