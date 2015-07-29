import { Deferred } from './deferred'
import { DeferredAsync } from './deferred-async'
import { staticMethods, instanceMethods } from './methods'
import { merge } from './utils'

merge(Deferred, staticMethods)
merge(Deferred.prototype, instanceMethods)

export default Deferred
export { Deferred as sync, DeferredAsync as async }
