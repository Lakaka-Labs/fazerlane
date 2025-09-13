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
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import LaneHandler from "./lane/handler.ts";
import {Authorize} from "./middlewares/authorization.ts";
import http from "http";
import {WebSocketServer} from "ws";
import {BadRequestError} from "../../../packages/errors";
import type Adapters from "../../adapters";
import {ApiError} from "../../../packages/errors/";

export default class ExpressHTTP {
    appSecrets: AppSecrets
    services: Services
    adapters: Adapters
    server: Express;
    bareServer: http.Server
    websocketServer: WebSocketServer

    router = express.Router();

    constructor(appSecrets: AppSecrets, services: Services, adapters: Adapters) {
        this.appSecrets = appSecrets
        this.services = services
        this.adapters = adapters
        this.server = express();
        this.bareServer = http.createServer(this.server)
        this.websocketServer = new WebSocketServer({server: this.bareServer})  // Single server

        // Middlewares
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: true}));
        this.server.use(helmet())
        this.server.use(cookieParser(this.appSecrets.cookieSecret));
        const corsOptions = {
            origin: this.appSecrets.clientOrigin,
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

        this.websocketSetup()

        // Passport
        this.server.use(passport.initialize());

        this.health()
        this.authentication()
        this.lane()

        this.server.use(`/api/v1`, this.router);

        this.server.use(Route404);
        this.server.use(ErrorHandlerMiddleware);
    }

    listen() {
        this.bareServer.listen(this.appSecrets.port, () => {
            console.log(`Listening on port http://localhost:${this.appSecrets.port}...`);
        })
    }

    health() {
        this.server.get('/health', async (req, res) => {
            const milestones =await this.adapters.milestoneRepository.get("cc79d1bd-23cf-4852-a865-bc6478816387")
            console.log({milestones})
            return res.status(StatusCodes.OK).send("server up")
        })
    }

    authentication = () => {
        const router = new AuthenticationHandler(this.services.authenticationService, this.appSecrets);
        this.server.use("/auth", router.router);
    };

    lane = () => {
        const router = new LaneHandler(this.services.laneService);
        this.router.use("/lane", Authorize(this.services.authenticationService), router.router);
    };

    websocketSetup = () => {
        this.websocketServer.on('connection', async (ws, request) => {
            if (!request.url) {
                ws.close(1002, 'Invalid path');
                return;
            }

            const {pathname} = new URL(request.url, this.appSecrets.wsUrl);

            if (pathname.startsWith('/progress')) {
                try {
                    let url = request.url;
                    if (!url) throw new BadRequestError("invalid url")

                    const urlParts = url.split("/").filter((segment: string) => segment !== ''); // Remove empty segments

                    let laneId = urlParts[urlParts.length - 1];
                    if (!laneId) throw new BadRequestError("conversation ID not found");

                    (ws as any).laneId = laneId;
                    (ws as any).type = 'chat';

                    this.adapters.progressWebsocketRepository.Register(ws, laneId);

                    ws.on('error', () => {
                        this.adapters.progressWebsocketRepository.Unregister(ws, laneId);
                    });

                    ws.on('close', () => {
                        this.adapters.progressWebsocketRepository.Unregister(ws, laneId);
                    });

                    ws.on('message', (data) => {
                    });

                    ws.send('connected');

                } catch (err) {
                    console.log(err)
                    if (err instanceof ApiError) {
                        let closeCode = 1011; // Internal error
                        if (err.statusCode === 401) closeCode = 1008; // Policy violation (unauthorized)
                        if (err.statusCode === 403) closeCode = 1008; // Policy violation (forbidden)
                        if (err.statusCode === 404) closeCode = 1002; // Protocol error (not found)
                        ws.close(closeCode, err.message);
                    } else {
                        ws.close(1011, 'Internal server error');
                    }
                }
            } else if (pathname === '/price') {
            } else {
                ws.close(1002, 'Unknown path');
            }
        });
    }


}