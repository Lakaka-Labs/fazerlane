import express, {type Express} from "express";
import AppSecrets from "../../../packages/secret";
import {StatusCodes} from "http-status-codes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors'
import MorganMiddleware from "./middlewares/morgan.ts";

export default class HTTPPort {
    applicationSecret: AppSecrets
    server : Express

    constructor(applicationSecret: AppSecrets) {
        this.applicationSecret = applicationSecret
        this.server = express()

        // Middlewares
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: true}));
        this.server.use(helmet())
        this.server.use(cookieParser(this.applicationSecret.cookieSecret));
        const corsOptions = {
            origin: this.applicationSecret.clientOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'ngrok-skip-browser-warning' // Important for ngrok
            ],
        };
        this.server.use(cors(corsOptions));
        let morganMiddleware = new MorganMiddleware()
        this.server.use(morganMiddleware.middleware)

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