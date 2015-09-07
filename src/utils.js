export const callAsync = (() => {
  // https://github.com/isaacs/node-bench/blob/master/lib/bench.js

  let nT, sI
  const sT = (fn) => setTimeout(fn, 0)

  if (typeof process !== 'undefined' && process && typeof process.nextTick === 'function') {
    nT = process.nextTick
  }

  if (typeof setImmediate === 'function') {
    sI = setImmediate
  }

  const _nt = sI || nT
  if (!_nt) return sT

  let _ntN = 0

  return function callAsync (fn) {
    if (_ntN++ < 100) {
      nT(fn)
    } else {
      _nt(fn)
      _ntN = 0
    }
  }
})()
