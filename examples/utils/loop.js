import Deferred from '../../src'

export default function loop (n, fun) {
  const o = {
    begin: n.begin || 0,
    end: (typeof n.end === 'number') ? n.end : n - 1,
    step: n.step || 1,
    last: false,
    prev: null,
  }

  let ret
  const { step } = o

  return Deferred.resolve().then(function () {
    function _loop (i) {
      if (i <= o.end) {
        if ((i + step) > o.end) {
          o.last = true
          o.step = o.end - i + 1
        }
        o.prev = ret

        const d = new Deferred(() => fun(i, o))
        d.then((r) => {
          ret = r
          return Deferred.resolve(i + step).then(_loop)
        })
        d.resolve()
      } else {
        return ret
      }
    }

    return (o.begin <= o.end) ? Deferred.resolve(o.begin).then(_loop) : null
  })
}
