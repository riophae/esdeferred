import Promise from 'yaku'

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

  resolve (val) {
    this._execute('onFulfilled', val)
  }

  reject (err) {
    this._execute('onRejected', err)
  }

  _execute (callbackName, x) {
    new Promise((resolve) => resolve(this.cb[callbackName](x)))
      .then((val) => {
        if (val && typeof val === 'object' && typeof val.then === 'function') {
          val.then(this._afterFulfilled, this._afterRejected)
        } else {
          this._afterFulfilled(val)
        }
      }, (err) => {
        this._afterRejected(err)
      })
  }

  _executeNext (callbackName, x) {
    if (this._next !== null) {
      this._next._execute(callbackName, x)
    }
  }
}

Deferred.success = (val) => val
Deferred.error = (err) => new Promise((_, reject) => reject(err))

Deferred.resolve = (val) => Deferred._executeAsync('onFulfilled', val)
Deferred.reject = (err) => Deferred._executeAsync('onRejected', err)
Deferred._executeAsync = (callbackName, x) => {
  const d = new Deferred()
  callAsync(() => d._execute(callbackName, x))
  return d
}

export { Deferred }
