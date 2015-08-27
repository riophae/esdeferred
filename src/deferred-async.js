import { Deferred } from './deferred'

class DeferredAsync extends Deferred {
  constructor (onFulfilled = Deferred.success, onRejected = Deferred.error) {
    const onFulfilledAsync = (val) => {
      const d = Deferred.resolve(val)
      return d.then(onFulfilled)
    }
    const onRejectedAsync = (err) => {
      const d = Deferred.reject(err)
      return d.catch(onRejected)
    }

    super(onFulfilledAsync, onRejectedAsync)
  }

  then (onFulfilled, onRejected) {
    this._next = new DeferredAsync(onFulfilled, onRejected)
    return this._next
  }
}

export { DeferredAsync }
