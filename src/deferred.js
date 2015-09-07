import { $internal as $ } from './const'

class Deferred {
  static success = (val) => { return val }
  static error = (err) => { throw err }

  constructor (onFulfilled = Deferred.success, onRejected = Deferred.error) {
    this.cb = { onFulfilled, onRejected }
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

  always (callback) {
    return this.then(callback, callback)
  }

  resolve (val) {
    this[$.execute]('onFulfilled', val)
  }

  reject (err) {
    this[$.execute]('onRejected', err)
  }

  [$.execute] (callbackName, x) {
    let val, err
    let noError = true

    try {
      val = this.cb[callbackName](x)
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

  [$.executeNext] (callbackName, x) {
    if (this.next !== null) {
      this.next[$.execute](callbackName, x)
    }
  }
}

export { Deferred }
