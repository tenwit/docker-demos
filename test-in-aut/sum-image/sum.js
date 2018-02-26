var seneca = require('seneca')()

seneca.add('role:math,cmd:sum', (msg, reply) => {
  reply(null, {answer: (msg.left + msg.right)})
})

seneca.act({role: 'math', cmd: 'sum', left: 1, right: 2}, function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})