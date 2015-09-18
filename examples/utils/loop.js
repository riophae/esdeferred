import Deferred from '../../src'

export default function loop (n, func) {
  const o = {
    begin: n.begin || 0,
    end: (typeof n.end === 'number') ? n.end : n - 1,
    step: n.step || 1,
    last: false,
    prev: null,
  }

  let ret = null
  const { step } = o

  return Deferred.call(() => {
    function _loop (i) {
      if (i <= o.end) {
        if ((i + step) > o.end) {
          o.last = true
          o.step = o.end - i + 1
        }
        o.prev = ret

        return Deferred.call(() => func(i, o))
          .then((r) => {
            ret = r
            return Deferred.call(_loop, i + step)
          })
      } else {
        return ret
      }
    }

    return _loop(o.begin)
  })
}
