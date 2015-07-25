import Deferred from '../src'

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
    return Deferred.error('test err')
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
    return Deferred.error(val)
  }).sleep(1000).catch((err) => {
    console.error('expected error:', err)
  })
}
// test3()

function test4 () {
  const arr = [ 1, 2, 3, 4, 5 ].reverse()
  const deferreds = arr.map((num) => {
    const delay = num * 200
    console.log('#%d sleeping %dms...', num, delay)
    return Deferred.sleep(delay).then(() => {
      console.log('resolved:', num)
      return num * 100
    })
  })
  Deferred.map(deferreds).then((result) => console.log('result', result))
}
// test4()

function test5 () {
  let d = Deferred.resolve()
  d.then(function () {
    return Deferred.reject('err').then(log).catch((err) => {
      console.error('error:', err)
    })
  })
}
test5()
