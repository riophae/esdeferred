export const callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout

export const throwErr = (err) => {
  callAsync(() => { throw err })
}

export const entries = function * (obj) {
  for (const key of Object.keys(obj)) {
    yield [ key, obj[key] ]
  }
}
