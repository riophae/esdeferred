const utils = {}

utils.callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

utils.throw = (err) => {
  utils.callAsync(() => { throw err })
}

utils.entries = function * (obj) {
  for (let key of Object.keys(obj)) {
    yield [ key, obj[key] ]
  }
}

utils.merge = (to, ...froms) => {
  for (let from of froms) {
    for (let [ k, v ] of utils.entries(from)) {
      to[k] = v
    }
  }

  return to
}

export default utils
