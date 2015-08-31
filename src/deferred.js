import { callAsync } from './utils'

class Deferred {
  constructor (onFulfilled = Deferred.success, onRejected = Deferred.error) {
    this.cb = { onFulfilled, onRejected }

    this._next = null

    this._afterFulfilled = this._executeNext.bind(this, 'onFulfilled')
    this._afterRejected = this._executeNext.bind(this, 'onRejected')
  }

  then (onFulfilled, onRejected) {
    this._next = new Deferred(onFulfilled, onRejected)
    return this._next
  }

  catch (onRejected) {
    return this.then(Deferred.success, onRejected)
  }

  always (callback) {
    return this.then(callback, callback)
  }

  _execute (callbackName, x) {
    let val, err
    let noError = true

    try {
      val = this.cb[callbackName](x)
    } catch (e) {
      err = e
      noError = false
    }

    if (val && typeof val === 'object' && typeof val.then === 'function') {
      val.then(this._afterFulfilled, this._afterRejected)
    } else {
      if (noError === true) {
        this._afterFulfilled(val)
      } else {
        this._afterRejected(err)
      }
    }
  }

  _executeNext (callbackName, x) {
    if (this._next !== null) {
      this._next._execute(callbackName, x)
    }
  }
}

Deferred.success = (val) => val
Deferred.error = (err) => { throw err }

Deferred._executeAsync = (callbackName, x) => {
  const d = new Deferred()
  callAsync(() => d._execute(callbackName, x))
  return d
}
Deferred.resolve = (val) => Deferred._executeAsync('onFulfilled', val)
Deferred.reject = (err) => Deferred._executeAsync('onRejected', err)

export { Deferred }
