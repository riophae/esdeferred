import { Deferred } from './deferred'
import { callAsync } from './utils'

export class Promise {
  constructor (func) {
    const d = new Deferred()
    callAsync(() => func(::d.resolve, ::d.reject))
    return d
  }
}
