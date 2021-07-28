import { IncomingMessage, Server, ServerResponse } from "http"

const http = require("http"), os = require("os")

if (process.env.NODE_ENV === "development")
    require("dotenv").config()

const PORT = process.env.PORT || 1313
const HOST = process.env.HOST || "0.0.0.0"

const bodyJSON = { status: "ok" }

// listener for HHTP request
// (req, res) => {}
const requestListener = (incomingMessage: IncomingMessage, serverResponse: ServerResponse) => {
    serverResponse
        .writeHead(200, {
            'Content-Type': 'application/json',
        })
        .end(JSON.stringify(bodyJSON))
    // above code is same as
    // serverResponse.statusCode = 200
    // serverResponse.setHeader('Content-Type', 'application/json')
    // serverResponse.end(JSON.stringify(bodyJSON))
}

const listenCallback = (server?: Server) => {
    console.clear()
    const SERV_URL = os.networkInterfaces().eth0[0].address;

    if (process.env.NODE_ENV === "development") {
        console.log(`server listening on: http://127.0.0.1:${PORT}`)
    }

    console.log(`server listening on: http://${SERV_URL}:${PORT}`)
    // setTimeout(() => server.close(), 5000)
}

// request * response listener
const server: Server = http.createServer(requestListener)

// server event listener
server.on("close", () => console.log("server closed"))
// addListener is an alias for emmit
// server.addListener("close", () => console.log("server closed"))

// client error listener
server.on("clientError", (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

// start listening on PORT (async)
server.listen({ port: PORT, host: HOST, ipv6Only: false }, listenCallback)

