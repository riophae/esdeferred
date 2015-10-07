import { Deferred } from './deferred'
import { staticMethods, instanceMethods } from './methods'

Object.assign(Deferred, staticMethods)
Object.assign(Deferred.prototype, instanceMethods)

export default Deferred
export { Promise } from './promise'
