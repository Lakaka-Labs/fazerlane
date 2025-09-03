import express, {type Express} from "express";
import AppSecrets from "../../../packages/secret";
import {StatusCodes} from "http-status-codes";

export default class HTTPPort {
    applicationSecret: AppSecrets
    server : Express

    constructor(applicationSecret: AppSecrets) {
        this.applicationSecret = applicationSecret
        this.server = express()

        this.health()
    }

    health () {
        this.server.get('/health', (req, res) => {
           return res.status(StatusCodes.OK).send("server up")
        })
    }

    listen () {
        this.server.listen(this.applicationSecret.port,()=>{
            console.log(`Listening on port http://localhost:${this.applicationSecret.port}...`);
        })
    }
}