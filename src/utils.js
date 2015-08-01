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

utils.merge = (to, ...froms) => {
  for (const from of froms) {
    for (const [ k, v ] of utils.entries(from)) {
      to[k] = v
    }
  }

  return to
}

export default utils
