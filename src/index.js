import { Deferred } from './deferred'
import { DeferredAsync } from './deferred-async'
import { staticMethods, instanceMethods } from './methods'

Object.assign(Deferred, staticMethods)
Object.assign(Deferred.prototype, instanceMethods)

export default Deferred
export { Deferred as sync, DeferredAsync as async }
