/*
Author: chankruze (chankruze@geekofia.in)
Created: Thu Jul 29 2021 09:09:19 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

import { IncomingMessage, Server, ServerResponse } from "http"

const cluster = require("cluster"),
    os = require("os"),
    http = require("http"),
    log = require("./utils").log

// num of cpus
const numOfCPUs = os.cpus().length - 8

// dev env
if (process.env.NODE_ENV === "development")
    require("dotenv").config()

const PORT = process.env.PORT || 1313
const HOST = process.env.HOST || "0.0.0.0"

const bodyJSON = { status: "ok" }

const listenCallback = () => {
    console.clear()
    const SERV_URL = os.networkInterfaces().eth0[0].address;

    if (process.env.NODE_ENV === "development") {
        log(`server listening on: http://127.0.0.1:${PORT}`, "success")
    }

    log(`server listening on: http://${SERV_URL}:${PORT}`, "success")
    // setTimeout(() => server.close(), 5000)
}

if (cluster.isMaster) {
    log(`[${process.pid}] master process`, "success")

    // fork workers
    // The worker processes are spawned using the child_process.fork() method, 
    // so that they can communicate with the parent via IPC and pass server 
    // handles back and forth.
    for (let i = 0; i < numOfCPUs; ++i) {
        cluster.fork()
    }

    // cluster.on('fork', (worker) => {
    //     console.log('worker is dead:', worker.isDead());
    // });

    // cluster.on('exit', (worker, code, signal) => {
    //     console.log('worker is dead:', worker.isDead());
    // });

    Object.keys(cluster.workers).forEach((key) => {
        const worker = cluster.workers[key]

        worker.on('listening', (address: string) => {
            log({
                msg: `Worker listening`,
                address: address["address"],
                port: address['port']
            }, "success")
        });

        worker.on('disconnect', () => {
            log("Worker disconnected", "error")
        });
    })
}

if (cluster.isWorker) {
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
    // request * response listener
    const server: Server = http.createServer(requestListener)

    if (cluster.worker && cluster.worker.id) {
        try {
            server.listen({ port: PORT, host: HOST, ipv6Only: false }, listenCallback)

            log({
                msg: `worker started`,
                wid: cluster.worker.id,
                pid: process.pid
            }, "success")

            process.on('message', (msg) => {
                if (msg === 'shutdown') {
                    // Initiate graceful close of any connections to server
                    log("killing worker", "error")
                    process.kill(process.pid)
                    process.disconnect()
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}
