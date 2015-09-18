import repeat from './utils/repeat'

repeat(100, (n) => {
  console.log(n)

  for (let i = 0; i < Math.pow(n, 2); i++) {
    for (let j = n; j; j--);
  }
})
