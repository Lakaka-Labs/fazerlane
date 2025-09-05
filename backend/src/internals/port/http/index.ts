import express, {type Express} from "express";
import AppSecrets from "../../../packages/secret";
import {StatusCodes} from "http-status-codes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors'
import MorganMiddleware from "./middlewares/morgan.ts";
import ErrorHandlerMiddleware from "./middlewares/errorHandler.ts";
import Route404 from "./middlewares/invalidRoute.ts";
import passport from "passport";
import AuthenticationHandler from "./authentication/handler.ts";
import type Services from "../../services";

export default class HTTPPort {
    applicationSecret: AppSecrets
    services: Services
    server : Express
    router = express.Router();

    constructor(applicationSecret: AppSecrets, services: Services) {
        this.applicationSecret = applicationSecret
        this.services = services
        this.server = express()
        this.router = express.Router();

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

        // Passport
        this.server.use(passport.initialize());

        this.health()
        this.authentication()

        this.server.use(`/api/v1`, this.router);

        this.server.use(Route404);
        this.server.use(ErrorHandlerMiddleware);
    }

    health () {
        this.server.get('/health', (req, res) => {
           return res.status(StatusCodes.OK).send("server up")
        })
    }

    authentication = () => {
        const router = new AuthenticationHandler(this.services.authenticationService, this.applicationSecret);
        this.server.use("/auth", router.router);
    };

    listen () {
        this.server.listen(this.applicationSecret.port,()=>{
            console.log(`Listening on port http://localhost:${this.applicationSecret.port}...`);
        })
    }
}