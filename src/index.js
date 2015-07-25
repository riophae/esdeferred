import merge from 'lodash.merge'

import { Deferred } from './deferred'
import { DeferredAsync } from './deferred-async'
import methods from './methods'

merge(Deferred, methods.static)
merge(Deferred.prototype, methods.instance)

export default Deferred
export { Deferred as sync, DeferredAsync as async }
