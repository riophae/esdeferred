import { Deferred } from './deferred'

class DeferredAsync extends Deferred {
  constructor (...funcs) {
    super(...funcs)
  }
}

export { DeferredAsync }
