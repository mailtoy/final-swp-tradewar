const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')

const client = new Twitter({
  consumer_key: 'pPwx6OPsT2sBzJDtN1dJRL0Bs',
  consumer_secret: 'EngrOrYHrKr8FvFIFiIphYcAaa3nsoh4LqR8my1R3z9iVl2KWK',
  access_token_key: '519080427-zoZUTXsaJiAzLu3jB6J46ifxQ7HvxEaVOYRIJ1cp',
  access_token_secret: 'D565kRNL8pO4kUTeyMGbMd26SAxBVuzoc3tnC50MkfNtH'
})

const port = '4000'

const app = server.listen(port, () => {
  console.log('Server is listening at ' + port)
})

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')

  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const stream = client.stream('statuses/filter', { track: 'tradewar' })
stream.on('data', function (event) {
  if (event)
    io.sockets.emit('new-message', event.text)
})
