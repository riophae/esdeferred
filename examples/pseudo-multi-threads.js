import Deferred from '../src'
import loop from './utils/loop'

loop(10, function (n) {
  console.log(n)
  return Deferred.sleep(200)
})

loop(10, function (n) {
  console.log(String.fromCharCode(97 + n))
  return Deferred.sleep(100)
})
