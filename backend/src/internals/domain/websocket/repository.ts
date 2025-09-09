import WebSocket from 'ws';
import type {BroadcastParameters} from "./";

export interface ProgressWebsocketRepository {
    Register(conn: WebSocket, laneId: string): void;
    Unregister(conn: WebSocket, laneId: string): void;
    Broadcast(message: BroadcastParameters, laneId: string): void;
}