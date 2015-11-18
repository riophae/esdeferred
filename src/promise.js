import { Deferred } from './deferred'
import nextTick from 'next-tick'

export class Promise {
  constructor (func) {
    const d = new Deferred()
    nextTick(() => func(::d.resolve, ::d.reject))
    return d
  }
}
