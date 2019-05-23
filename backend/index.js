const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')
var firebase = require('firebase')
var app = firebase.initializeApp({
    apiKey: "AIzaSyCReBeYn8Ig6Xx2dz_FOEpCMUYwNWI-zjs",
    authDomain: "prefinal-241418.firebaseapp.com",
    databaseURL: "https://prefinal-241418.firebaseio.com",
    projectId: "prefinal-241418",
    storageBucket: "prefinal-241418.appspot.com",
    messagingSenderId: "199805963234",
    appId: "1:199805963234:web:4591a3862404b39b"
})

const client = new Twitter({
    consumer_key: 'pPwx6OPsT2sBzJDtN1dJRL0Bs',
    consumer_secret: 'EngrOrYHrKr8FvFIFiIphYcAaa3nsoh4LqR8my1R3z9iVl2KWK',
    access_token_key: '519080427-zoZUTXsaJiAzLu3jB6J46ifxQ7HvxEaVOYRIJ1cp',
    access_token_secret: 'D565kRNL8pO4kUTeyMGbMd26SAxBVuzoc3tnC50MkfNtH'
})

const port = '4000'

const serverApp = server.listen(port, () => {
    console.log('Server is listening at ' + port)
})

let events = []
app.database().ref('tweets').once('value', function (snapshots) {
    if (snapshots.val()) {
        events = Object.values(snapshots.val())
    }
})

const io = socketIO.listen(serverApp)
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')
    io.sockets.emit('messages', events)
    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })
})

const stream = client.stream('statuses/filter', { track: '#tradewar' })
stream.on('data', function (event) {
    if (event) {
        // io.sockets.emit('new-message', event)
        events.push(event)
        io.sockets.emit('messages', events)
        app.database().ref('tweets').set(events)
    }
})
