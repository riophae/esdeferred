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

  const _nT = sI || nT
  if (!_nT) return sT
  if (!nT) return sI

  let _nTN = 0

  return function callAsync (fn) {
    if (_nTN++ < 100) {
      nT(fn)
    } else {
      _nT(fn)
      _nTN = 0
    }
  }
})()
