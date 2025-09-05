import type {GetUserParameters, User} from "../../domain/user/index.ts";
import type Repository from "../../domain/user/repository.ts";
import {SQL} from "bun";
import {NotFoundError} from "../../../packages/errors";

export default class UserRepositoryPG implements Repository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    async get(parameter: GetUserParameters): Promise<User> {
        const conditions: any[] = [];

        if (parameter.id) {
            conditions.push(this.sql`id = ${parameter.id}`);
        }

        if (parameter.email) {
            conditions.push(this.sql`email = ${parameter.email}`);
        }

        if (parameter.googleId) {
            conditions.push(this.sql`google_id = ${parameter.googleId}`);
        }

        if (parameter.username) {
            conditions.push(this.sql`username = ${parameter.username}`);
        }

        // If no conditions provided, throw error or return null
        if (conditions.length === 0) {
            throw new Error('At least one search parameter must be provided');
        }

        // Join conditions with AND
        const whereClause = conditions.reduce((acc, condition, index) => {
            if (index === 0) {
                return condition;
            }
            return this.sql`${acc} AND ${condition}`;
        });

        const rows = await this.sql`
            SELECT id, email, google_id, username, created_at, updated_at
            FROM users
            WHERE ${whereClause}
            LIMIT 1
        `;

        if (rows.length === 0) {
            throw new NotFoundError("user does not exist")
        }

        // Map database row to User object
        const row = rows[0];
        return {
            id: row.id,
            email: row.email,
            googleId: row.google_id,
            username: row.username,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async add(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        const userData = {
            email: user.email,
            ...(user.googleId && {google_id: user.googleId}),
            ...(user.username && {username: user.username})
        };

        const [newUser] = await this.sql`
            INSERT INTO users ${this.sql(userData)}
                RETURNING id, email, google_id, username, created_at, updated_at
        `;

        return {
            id: newUser.id,
            email: newUser.email,
            googleId: newUser.google_id,
            username: newUser.username,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at
        };
    };
}