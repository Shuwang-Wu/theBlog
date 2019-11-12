/*eslint-disable*/
var http = require('http')
var ws = require('websocket-server')

var clientui = require('fs').readFileSync('web_socket.html')

var httpServer = new http.Server()

httpServer.on('request', function(request, response) {
  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.write(clientui)
    response.end()
  } else {
    response.writeHead(404)
    response.end()
  }
})

var wsserver = ws.createServer({ server: httpServer })

wsserver.on('connection', function(socket) {
  socket.send('Welcome to the chat room')
  socket.on('message', function(msg) {
    wsserver.broadcast(msg)
  })
})

wsserver.listen(8000)
