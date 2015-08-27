export const callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

export const entries = function * (obj) {
  for (const key of Object.keys(obj)) {
    yield [ key, obj[key] ]
  }
}

export const filterMap = function (obj, filterFn) {
  const map = {}

  for (const [ k, v ] of entries(obj)) {
    if (filterFn(v, k)) {
      map[k] = v
    }
  }

  return map
}
