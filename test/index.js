import Deferred, { Promise } from '../src'

const log = (x) => {
  console.log(x)
  return x
}

function test1 () {
  var d = new Deferred()
  d.then(function (val) {
    return val + 1
  }).then(function (val) {
    console.log('waiting...')
    let d = new Deferred()
    setTimeout(() => {
      d.resolve(val * 2)
    }, 2000)
    return d
  }).then(function (val) {
    console.log(val)
    return Deferred.failure('test err')
  }).catch(function (err) {
    console.error(err)
    throw err
  }).then(function (val) {
    console.log('this will not be executed')
  }).always(function (x) {
    console.log('always get this:', x)
  })
  d.resolve(100)
}
// test1()

function test2 () {
  const arr = [ 1, 2, 3, 4, 5 ].reverse()
  const deferreds = arr.map((num) => {
    const d = new Deferred((val) => {
      const delay = num * 200
      return Deferred.sleep(delay).then(() => {
        console.log('waited %dms', delay)
        console.log('cur: %d sum: %d', num, val)
        return val + num
      })
    })
    return d
  })

  Deferred.reduce(deferreds, 0).then((result) => {
    console.log('done:', result)
  }).catch(console.error.bind(console, 'global error:'))
}
// test2()

function test3 () {
  Deferred.resolve(2).then((val) => {
    log(val)
    log('going to sleep...')
    return val
  }).sleep(1000).then((val) => {
    log(val)
    log('going to sleep...')
    return Deferred.failure(val)
  }).sleep(1000).catch((err) => {
    console.error('expected error:', err)
  })
}
// test3()

function test4 () {
  const arr = [ 1, 2, 3, 4, 5 ].reverse()
  const deferreds = arr.map((num) => {
    const delay = num * 500
    console.log('#%d sleeping %dms...', num, delay)
    const t = Date.now();
    return Deferred.sleep(delay).then(() => {
      console.log(`resolved in ${Date.now() - t}ms:`, num)
      return num * 100
    })
  })
  Deferred.map(deferreds).then((result) => console.log('result', result))
}
// test4()

function test5 () {
  let d = Deferred.resolve()
  d.then(function () {
    return Deferred.reject('everthing is fine').then(log.bind(null, 'should not see this:')).catch((err) => {
      console.error('error:', err)
    })
  })
}
// test5()

function test6 () {
  const p = new Promise((res) => res(100))
  p.then(log)
}
test6()
