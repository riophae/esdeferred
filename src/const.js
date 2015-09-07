export const $internal = Object.freeze({
  execute: Symbol('Deferred#execute'),
  executeNext: Symbol('Deferred#executeNext'),
  afterFulfilled: Symbol('Deferred@afterFulfilled'),
  afterRejected: Symbol('Deferred@afterRejected'),
})
