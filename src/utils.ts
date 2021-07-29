/*
Author: chankruze (chankruze@geekofia.in)
Created: Thu Jul 29 2021 11:06:16 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

const chalk = require("chalk")

const date = new Date(Date.now())

const padZero = (num: number) => num.toString().padStart(2, "0")

const dateFormat = `[${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())} ${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()}]`

const log = (msg: any, level?: string) => {
    switch (level) {
        case "success":
            console.log(chalk`{blue ${dateFormat}} {green %s}`, msg)
            break
        case "error":
            console.log(chalk`{blue ${dateFormat}} {redBright %s}`, msg)
            break
    }
}

module.exports = Object.freeze({
    log
})