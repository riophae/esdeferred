import Deferred from '../../src'

export default function repeat (n, f) {
  let i = 0

  const worker = () => Deferred.resolve().then(() => {
    const t = Date.now()

    do {
      if (i >= n) return null
      f(i++)
    } while (Date.now() - t < 20)

    return worker()
  })

  return worker()
}
