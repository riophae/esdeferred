import { Deferred } from './deferred'

class DeferredAsync extends Deferred {
  constructor (onFulfilled = Deferred.success, onRejected = Deferred.error) {
    const onFulfilledAsync = DeferredAsync.success.bind(null, onFulfilled)
    const onRejectedAsync = DeferredAsync.error.bind(null, onRejected)

    super(onFulfilledAsync, onRejectedAsync)
  }

  then (...callbacks) {
    this._next = new DeferredAsync(...callbacks)
    return this._next
  }
}

DeferredAsync.success = (onFulfilled, val) => {
  const d = Deferred.resolve(val)
  return d.then(onFulfilled)
}

DeferredAsync.error = (onRejected, err) => {
  const d = Deferred.reject(err)
  return d.catch(onRejected)
}

export { DeferredAsync }
