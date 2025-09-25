export type PostgresCredentials = {
    user: string
    password: string
    db: string
    host: string
    port: number
    ssl: boolean
}
export type RedisCredentials = {
    user: string
    password: string
    host: string
    port: number
    maxRetriesPerRequest: number | null
}

export type GoogleOAuthCredentials = {
    id: string
    secret: string
    callbackUrl: string
}

export type GeminiConfiguration = {
    apiKey: string
    model: string
}

export type SMTPCredentials = {
    fromAddress: string
    host: string
    port: number
    username: string
    password: string
}

export type Urls = {
    verifyEmail: string
    resetPasswordEmail: string
    logo: string
    uiDashboard: string
    uiLogin: string
}

export type XPPoints = {
    streak: number
    easy: number
    medium: number
    hard: number
    firstTry: number
    deductPerFail: number
    completed25: number
    completed50: number
    completed75: number
    completed100: number
}

export default class AppSecrets {
    port: number;
    clientOrigin: string
    cookieExpires: number
    cookieSecret: string
    emailJWTExpires: number
    emailJWTSecret: string
    jwtExpires: number
    jwtSecret: string
    refreshJWTExpires: number
    refreshJWTSecret: string
    wsUrl: string
    postgresCredentials: PostgresCredentials
    redisCredentials: RedisCredentials
    googleOAuthCredentials: GoogleOAuthCredentials
    geminiConfiguration: GeminiConfiguration
    googleAPIKey: string
    maxYoutubeLength: number
    maxVideoLength: number
    baseYoutubeApiUrl: string
    openaiAPIKey: string
    smtpCredential: SMTPCredentials
    urls: Urls
    xpPoints: XPPoints

    constructor() {
        this.port = this.getEnvironmentVariableAsNumber("PORT", 5000);
        this.clientOrigin = this.getEnvironmentVariableOrFallback("CLIENT_ORIGIN", "localhost:3000")
        this.cookieExpires = this.getEnvironmentVariableAsNumber("COOKIE_EXPIRES", 604_800);
        this.cookieSecret = this.getEnvironmentVariable("COOKIE_SECRET")
        this.emailJWTExpires = this.getEnvironmentVariableAsNumber("EMAIL_JWT_EXPIRES", 604_800);
        this.emailJWTSecret = this.getEnvironmentVariable("EMAIL_JWT_SECRET");
        this.jwtExpires = this.getEnvironmentVariableAsNumber("JWT_EXPIRES", 604_800);
        this.jwtSecret = this.getEnvironmentVariable("JWT_SECRET");
        this.refreshJWTExpires = this.getEnvironmentVariableAsNumber("REFRESH_JWT_EXPIRES", 2592000);
        this.refreshJWTSecret = this.getEnvironmentVariable("REFRESH_JWT_SECRET");
        this.wsUrl = this.getEnvironmentVariableOrFallback("WS_URL", "ws://localhost:1364");

        this.postgresCredentials = {
            user: this.getEnvironmentVariable("POSTGRES_USER"),
            password: this.getEnvironmentVariable("POSTGRES_PASSWORD"),
            db: this.getEnvironmentVariable("POSTGRES_DB"),
            host: this.getEnvironmentVariable("POSTGRES_HOST"),
            port: this.getEnvironmentVariableAsNumber("POSTGRES_PORT", 5432),
            ssl: this.getEnvironmentVariableAsBool("POSTGRES_SSL", false)
        }

        this.redisCredentials = {
            user: this.getEnvironmentVariable("REDIS_USER"),
            password: this.getEnvironmentVariable("REDIS_PASSWORD"),
            host: this.getEnvironmentVariable("REDIS_HOST"),
            port: this.getEnvironmentVariableAsNumber("REDIS_PORT", 6379),
            maxRetriesPerRequest: this.getEnvironmentVariableAsNumber("REDIS_MAX_RETRIES", -1) == -1
                ? null : this.getEnvironmentVariableAsNumber("REDIS_MAX_RETRIES", -1)
        }

        this.googleOAuthCredentials = {
            id: this.getEnvironmentVariable("GOOGLE_CLIENT_ID"),
            secret: this.getEnvironmentVariable("GOOGLE_CLIENT_SECRET"),
            callbackUrl: this.getEnvironmentVariable("GOOGLE_CLIENT_CALLBACK_URL"),
        }

        this.geminiConfiguration = {
            apiKey: this.getEnvironmentVariable("GEMINI_API_KEY"),
            model: this.getEnvironmentVariableOrFallback("GEMINI_MODEL", "gemini-2.5-flash"),
        }

        this.googleAPIKey = this.getEnvironmentVariable("GOOGLE_API_KEY")

        this.maxYoutubeLength = this.getEnvironmentVariableAsNumber("MAX_YOUTUBE_LENGTH", 600)
        this.maxVideoLength = this.getEnvironmentVariableAsNumber("MAX_VIDEO_LENGTH", 120)
        this.baseYoutubeApiUrl = this.getEnvironmentVariableOrFallback("BASE_YOUTUBE_API_URL", "https://www.googleapis.com/youtube/v3/videos")
        this.openaiAPIKey = this.getEnvironmentVariable("OPENAI_API_KEY")

        this.smtpCredential = {
            fromAddress: this.getEnvironmentVariable("SMTP_FROM_ADDRESS"),
            host: this.getEnvironmentVariable("SMTP_HOST"),
            password: this.getEnvironmentVariable("SMTP_PASSWORD"),
            port: this.getEnvironmentVariableAsNumber("SMTP_PORT", 587),
            username: this.getEnvironmentVariable("SMTP_USERNAME")
        }
        this.urls = {
            verifyEmail: this.getEnvironmentVariable("VERIFICATION_EMAIL_URL"),
            resetPasswordEmail: this.getEnvironmentVariable("RESET_PASSWORD_EMAIL_URL"),
            logo: this.getEnvironmentVariable("LOGO_URL"),
            uiDashboard: this.getEnvironmentVariable("UI_DASHBOARD_URL"),
            uiLogin: this.getEnvironmentVariable("UI_LOGIN_URL")
        }
        this.xpPoints = {
            streak: this.getEnvironmentVariableAsNumber("XP_POINT_STREAK", 25),
            easy: this.getEnvironmentVariableAsNumber("XP_POINT_EASY", 10),
            medium: this.getEnvironmentVariableAsNumber("XP_POINT_MEDIUM", 20),
            hard: this.getEnvironmentVariableAsNumber("XP_POINT_HARD", 30),
            firstTry: this.getEnvironmentVariableAsNumber("XP_POINT_FIRST_TRY", 5),
            deductPerFail: this.getEnvironmentVariableAsNumber("XP_POINT_DEDUCT_PER_FAIL", 2),
            completed25: this.getEnvironmentVariableAsNumber("XP_POINT_COMPLETED_25", 50),
            completed50: this.getEnvironmentVariableAsNumber("XP_POINT_COMPLETED_50", 75),
            completed75: this.getEnvironmentVariableAsNumber("XP_POINT_COMPLETED_75", 100),
            completed100: this.getEnvironmentVariableAsNumber("XP_POINT_COMPLETED_100", 150),
        }
    }

    getEnvironmentVariable(key: string): string {
        let value = process.env[key]
        if (!value) {
            console.error(`Error: Environment variable "${key}" is not available.`);
            process.exit(1)
        }
        return value
    }


    getEnvironmentVariableOrFallback(key: string, fallback: string): string {
        let value = process.env[key]
        if (!value) {
            return fallback
        }
        return value
    }

    getEnvironmentVariableAsNumber(key: string, fallback: number): number {
        let value = process.env[key];
        if (!value) {
            return fallback;
        }

        const valueNumber = Number(value);
        if (isNaN(valueNumber) || !isFinite(valueNumber)) {
            console.error(`Error: Environment variable "${key}" value "${value}" is not a valid number.`);
            process.exit(1);
        }

        return valueNumber;
    }

    getEnvironmentVariableAsBool(key: string, fallback: boolean): boolean {
        let value = process.env[key];
        if (!value) {
            return fallback;
        }

        const valueLower = value.toLowerCase();
        if (valueLower !== 'true' && valueLower !== 'false') {
            console.error(`Error: Environment variable "${key}" value "${value}" is not a valid boolean. Use "true" or "false".`);
            process.exit(1);
        }

        return valueLower === 'true';
    }

}