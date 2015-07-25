import { Deferred } from './deferred'

const methods = {
  static: {},
  instance: {}
}

methods.instance.spy = function (callback) {
  return this.then((val) => {
    return Deferred.resolve().then(() => {
      return callback(val)
    }).always(() => {
      return Deferred.success(val)
    })
  }, (err) => {
    return Deferred.resolve().then(() => {
      return callback(err)
    }).always(() => {
      return Deferred.error(err)
    })
  })
}

methods.static.sleep = methods.instance.sleep = function (duration) {
  const d = this instanceof Deferred ?
    this : Deferred.resolve()

  return d.spy((x) => {
    const sleepDeferred = new Deferred()
    setTimeout(() => sleepDeferred.resolve(), duration)
    return sleepDeferred
  })
}

methods.static.reduce = methods.static.serialize = (deferreds, initialVal) => {
  return deferreds.reduce((lastDeferred, currentDeferred) => {
    lastDeferred._next = currentDeferred
    return currentDeferred
  }, Deferred.resolve(initialVal))
}

methods.static.map = methods.static.parallel = (deferreds) => {
  let noErrors = true
  let pendingCount = deferreds.length
  const data = []
  const workerDeferred = new Deferred()

  for (let [ idx, deferred ] of deferreds.entries()) {
    deferred.catch((err) => {
      noErrors = false
      return err
    }).then((x) => {
      data[idx] = x
      if (--pendingCount === 0) {
        if (noErrors === true) {
          workerDeferred.resolve(data)
        } else {
          workerDeferred.reject(data)
        }
      }
    })
  }

  return workerDeferred
}

methods.static.some = methods.static.race = (deferreds) => {
  let pending = true
  let pendingCount = deferreds.length
  const errors = []
  const workerDeferred = new Deferred()

  for (let [ idx, deferred ] of deferreds.entries()) {
    deferred.then((val) => {
      if (pending === true) {
        pending = false
        workerDeferred.resolve(val)
      }
    }, (err) => {
      if (pending === true) {
        errors[idx] = err
        if (--pendingCount === 0) {
          pending = false
          workerDeferred.reject(errors)
        }
      }
    })
  }

  return workerDeferred
}

methods.static.every = (deferreds) => {
  let pending = true
  let pendingCount = deferreds.length
  const data = []
  const workerDeferred = new Deferred()

  for (let [ idx, deferred ] of deferreds.entries()) {
    deferred.then((val) => {
      if (pending === true) {
        data[idx] = val
        if (--pendingCount === 0) {
          pending = false
          workerDeferred.resolve(data)
        }
      }
    }, (err) => {
      pending = false
      return Deferred.error(err)
    })
  }

  return workerDeferred
}

export default methods
