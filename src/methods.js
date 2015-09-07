import { Deferred } from './deferred'

const staticMethods = {}
const instanceMethods = {}

instanceMethods.spy = function (callback) {
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

staticMethods.sleep = instanceMethods.sleep = function (duration) {
  const d = this instanceof Deferred ?
    this : Deferred.resolve()

  return d.spy((x) => {
    const sleepDeferred = new Deferred()
    setTimeout(() => sleepDeferred.resolve(), duration)
    return sleepDeferred
  })
}

staticMethods.reduce = staticMethods.serialize = (deferreds, initialVal) => {
  return deferreds.reduce((lastDeferred, currentDeferred) => {
    lastDeferred.next = currentDeferred
    return currentDeferred
  }, Deferred.resolve(initialVal))
}

staticMethods.map = staticMethods.parallel = (deferreds) => {
  let noErrors = true
  let pendingCount = deferreds.length
  const ret = []
  const workerDeferred = new Deferred()

  for (const [ idx, deferred ] of deferreds.entries()) {
    deferred.then((val) => {
      return [ null, val ]
    }, (err) => {
      noErrors = false
      return [ err ]
    }).then((arr) => {
      ret[idx] = arr
      if (--pendingCount === 0) {
        if (noErrors === true) {
          workerDeferred.resolve(ret)
        } else {
          workerDeferred.reject(ret)
        }
      }
    })
  }

  return workerDeferred
}

staticMethods.some = staticMethods.race = (deferreds) => {
  let pending = true
  let pendingCount = deferreds.length
  const errors = []
  const workerDeferred = new Deferred()

  for (const [ idx, deferred ] of deferreds.entries()) {
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

staticMethods.every = (deferreds) => {
  let noErrors = true
  let pendingCount = deferreds.length
  const ret = []
  const workerDeferred = new Deferred()

  for (const [ idx, deferred ] of deferreds.entries()) {
    deferred.then((val) => {
      if (noErrors === true) {
        ret[idx] = val
        if (--pendingCount === 0) {
          workerDeferred.resolve(ret)
        }
      }
    }, (err) => {
      noErrors = false
      workerDeferred.reject({ [idx]: err })
    })
  }

  return workerDeferred
}

export { staticMethods, instanceMethods }
