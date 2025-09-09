import type {ProgressWebsocketRepository} from "../../domain/websocket/repository";
import WebSocket from 'ws';
import type {BroadcastParameters} from "../../domain/websocket";

export class ProgressWebsocket implements ProgressWebsocketRepository {
    private clients: Map<string, Map<WebSocket, boolean>> = new Map();

    public Register(conn: WebSocket, laneId: string): void {
        if (!this.clients.has(laneId)) {
            this.clients.set(laneId, new Map());
        }

        const laneClients = this.clients.get(laneId)!;
        laneClients.set(conn, true);
    }

    public Unregister(conn: WebSocket, laneId: string): void {
        const laneClients = this.clients.get(laneId);
        if (laneClients && laneClients.has(conn)) {
            laneClients.delete(conn);
            conn.close();
        }
    }

    public Broadcast(message: BroadcastParameters, laneId: string): void {
        const messageBytes = JSON.stringify(message);
        const laneClients = this.clients.get(laneId.toString());
        if (laneClients) {
            const clientsToRemove: WebSocket[] = [];

            for (const [client] of laneClients) {
                try {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(messageBytes);
                    } else {
                        clientsToRemove.push(client);
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    clientsToRemove.push(client);
                }
            }

            clientsToRemove.forEach(client => {
                laneClients.delete(client);
                client.close();
            });
        }
    }
}