export const callAsync = typeof process !== 'undefined' && process.nextTick ?
  process.nextTick : setTimeout
