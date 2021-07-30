/*
Author: chankruze (chankruze@geekofia.in)
Created: Thu Jul 29 2021 20:48:52 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

import express from "express"
const os = require("os")

// dev env
console.log(`env: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === "development")
    require("dotenv").config()

const PORT = process.env.PORT || 1313
const HOST = process.env.HOST || "0.0.0.0"

const app = express()

app.get('/', (req, res) => {
    console.log(`New request from ${req.hostname}`)
    res.send({ status: "ok" })
})

app.get('/live-sex', (req, res) => {
    console.log("Accessing adult site")
    res.status(302).redirect("https://xhamsterlive.com/")
})

app.listen({ port: PORT, host: HOST }, () => {
    console.clear()
    const SERV_URL = os.networkInterfaces().eth0[0].address;

    console.log(`HOST: ${HOST}, PORT: ${PORT}`)

    if (process.env.NODE_ENV === "development") {
        console.log(`server accessible on: http://127.0.0.1:${PORT}`)
        console.log(`server accessible on: http://localhost:${PORT}`)
    }

    console.log(`server accessible on: http://${SERV_URL}:${PORT}`)
})