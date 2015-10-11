export const $internal = Object.freeze({
  execute: Symbol('Deferred#execute'),
  executeNext: Symbol('Deferred#executeNext'),
  executeAsync: Symbol('Deferred.executeAsync'),
  afterFulfilled: Symbol('Deferred@afterFulfilled'),
  afterRejected: Symbol('Deferred@afterRejected'),
})
