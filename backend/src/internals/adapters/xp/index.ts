import {SQL} from "bun";
import type XPRepository from "../../domain/xp/repository.ts";
import {XPType, type XP, type XPFilter} from "../../domain/xp";
import type BaseFilter from "../../../packages/types/filter";
import type {XPPoints} from "../../../packages/secret";
import {NotFoundError} from "../../../packages/errors";

export default class XPPG implements XPRepository {
    sql: SQL
    xpPoints: XPPoints

    constructor(postgresClient: SQL, xpPoints: XPPoints) {
        this.sql = postgresClient
        this.xpPoints = xpPoints
    }

    async streak(userId: string): Promise<void> {
        await this.sql.begin(async tx => {
            const rows = await tx`
                SELECT streak, xp
                FROM users
                WHERE id = ${userId}
                LIMIT 1
            `;

            if (rows.length === 0) {
                throw new NotFoundError("user does not exist")
            }

            let {streak, xp} = rows[0];

            let attemptToday = await this.checkAttemptMade(userId, 0)
            if (!attemptToday) {
                let yesterdayAttempt = await this.checkAttemptMade(userId, 1)
                if (yesterdayAttempt) {
                    streak += 1
                } else {
                    streak = 1
                }
                xp += this.xpPoints.streak
                await tx`
                    UPDATE users
                    SET ${tx({streak, xp})}
                    WHERE id = ${userId}
                `;
                await tx`INSERT into streaks ${tx({user_id: userId})}`;
                await tx`INSERT into xps ${tx({
                    user_id: userId,
                    amount: this.xpPoints.streak,
                    transaction_type: XPType.streak,
                    description: "daily practice streak",
                })}`;
            }
        })
    }

    async addXP(xp: Omit<XP, "id" | "createdAt">): Promise<void> {
        await this.sql.begin(async tx => {
            const rows = await tx`
                SELECT streak, xp
                FROM users
                WHERE id = ${xp.userId}
                LIMIT 1
            `;

            if (rows.length === 0) {
                throw new NotFoundError("user does not exist")
            }

            let {xp: currentXP} = rows[0];

            await tx`INSERT into xps ${this.sql({
                user_id: xp.userId,
                amount: xp.amount,
                transaction_type: xp.type,
                description: xp.description,
            })}`;
            await tx`
                UPDATE users
                SET ${tx({xp: xp.amount + currentXP})}
                WHERE id = ${xp.userId}
            `;
        })
    }

    async getStreaks(userId: string, filter: BaseFilter): Promise<Date[]> {
        const offset = (filter.page - 1) * filter.limit;

        // Build WHERE clause conditions
        let whereClause = `user_id = ${userId}`;
        const params: any[] = [userId];

        if (filter.startDate) {
            whereClause += ` AND created_at >= ${params.length + 1}`;
            params.push(new Date(filter.startDate));
        }
        if (filter.endDate) {
            whereClause += ` AND created_at <= ${params.length + 1}`;
            params.push(new Date(filter.endDate));
        }

        const rows = await this.sql`
            SELECT created_at
            FROM streaks
            WHERE user_id = ${userId}
                ${filter.startDate ? this.sql`AND created_at >= ${new Date(filter.startDate)}` : this.sql``}
                ${filter.endDate ? this.sql`AND created_at <= ${new Date(filter.endDate)}` : this.sql``}
            ORDER BY created_at DESC
            LIMIT ${filter.limit} OFFSET ${offset}
        `;

        return rows.map((row: any) => new Date(row.created_at));
    }

    async getXPs(userId: string, filter: XPFilter): Promise<XP[]> {
        const offset = (filter.page - 1) * filter.limit;

        const rows = await this.sql`
            SELECT id, user_id, amount, transaction_type, description, created_at
            FROM xps
            WHERE user_id = ${userId}
                ${filter.type ? this.sql`AND transaction_type = ${filter.type}` : this.sql``}
                ${filter.minAmount !== undefined ? this.sql`AND amount >= ${filter.minAmount}` : this.sql``}
                ${filter.maxAmount !== undefined ? this.sql`AND amount <= ${filter.maxAmount}` : this.sql``}
                ${filter.startDate ? this.sql`AND created_at >= ${new Date(filter.startDate)}` : this.sql``}
                ${filter.endDate ? this.sql`AND created_at <= ${new Date(filter.endDate)}` : this.sql``}
            ORDER BY created_at DESC
            LIMIT ${filter.limit} OFFSET ${offset}
        `;

        return rows.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            amount: row.amount,
            type: row.transaction_type as XPType,
            description: row.description,
            createdAt: new Date(row.created_at)
        }));
    }

    checkAttemptMade = async (userId: string, daysAgo: number = 0): Promise<boolean> => {
        const result = await this.sql`
            SELECT COUNT(*) as count
            FROM challenge_attempts
            WHERE user_id = ${userId}
              AND DATE(created_at) = CURRENT_DATE - ${daysAgo}
        `;
        return parseInt(result[0].count) > 0;
    };

}