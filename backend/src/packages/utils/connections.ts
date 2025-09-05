import { SQL } from "bun";
import type {PostgresCredentials} from "../secret";

export const postgresClientConnection = (postgresCredentials: PostgresCredentials): SQL =>{
    console.log(postgresCredentials.db)
    return new SQL({
        host: postgresCredentials.host,
        port: postgresCredentials.port,
        database: postgresCredentials.db,
        username: postgresCredentials.user,
        password: postgresCredentials.password,
        tls: postgresCredentials.ssl,

        onconnect: client => {
            console.log("Connected to PostgreSQL");
        },
        onclose: client => {
            console.log("PostgreSQL connection closed");
        },
    });
}
