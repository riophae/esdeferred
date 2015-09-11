import { callAsync } from './utils'
import { $internal as $ } from './const'

class Deferred {
  static success (val) { return val }
  static error (err) { throw err }

  constructor (onFulfilled = Deferred.success, onRejected = Deferred.error) {
    this.funcs = { onFulfilled, onRejected }
    this.next = null

    this[$.afterFulfilled] = this[$.executeNext].bind(this, 'onFulfilled')
    this[$.afterRejected] = this[$.executeNext].bind(this, 'onRejected')
  }

  then (onFulfilled, onRejected) {
    this.next = new Deferred(onFulfilled, onRejected)
    return this.next
  }

  catch (onRejected) {
    return this.then(Deferred.success, onRejected)
  }

  always (func) {
    return this.then(func, func)
  }

  resolve (val) {
    this[$.execute]('onFulfilled', val)
  }

  reject (err) {
    this[$.execute]('onRejected', err)
  }

  [$.execute] (funcName, x) {
    let val, err
    let noError = true

    try {
      val = this.funcs[funcName](x)
    } catch (e) {
      err = e
      noError = false
    }

    if (val && typeof val.then === 'function') {
      val.then(this[$.afterFulfilled], this[$.afterRejected])
    } else {
      if (noError === true) {
        this[$.afterFulfilled](val)
      } else {
        this[$.afterRejected](err)
      }
    }
  }

  [$.executeNext] (funcName, x) {
    if (this.next !== null) {
      this.next[$.execute](funcName, x)
    }
  }

  static [$.executeAsync] (funcName, x) {
    const d = new Deferred()
    callAsync(() => d[$.execute](funcName, x))
    return d
  }
  static resolve = (val) => Deferred[$.executeAsync]('onFulfilled', val)
  static reject = (err) => Deferred[$.executeAsync]('onRejected', err)
}

export { Deferred }
