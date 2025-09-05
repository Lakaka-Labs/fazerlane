import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import type AuthenticationService from "../../../services/authentication";
import {type Request, type Response, Router} from "express";
import {ForbiddenError} from "../../../../packages/errors";
import {generateJWTToken, generateRefreshJWTToken} from "../../../../packages/utils/encryption.ts";
import type Payload from "../../../../packages/types/payload";
import {SuccessResponseWithCookies} from "../../../../packages/responses/success.ts";
import type Cookie from "../../../../packages/types/cookies";
import type {User} from "../../../domain/user";
import {Authorize, AuthorizeRefreshToken} from "../middlewares/authorization.ts";
import type AppSecrets from "../../../../packages/secret";

export default class AuthenticationHandler {
    authenticationService: AuthenticationService
    appSecret: AppSecrets
    router: Router
    googleStrategy: GoogleStrategy

    constructor(authenticationService: AuthenticationService, appSecret: AppSecrets) {
        this.authenticationService = authenticationService
        this.appSecret = appSecret
        this.router = Router();
        this.googleStrategy = new GoogleStrategy({
            clientID: this.appSecret.googleOAuthCredentials.id,
            clientSecret: this.appSecret.googleOAuthCredentials.secret,
            callbackURL: this.appSecret.googleOAuthCredentials.callbackUrl
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await this.authenticationService.commands.authenticate.handle(profile.emails?.[0]?.value!, profile.id)
                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        })

        this.configureRoutes()
    }

    private configureRoutes() {
        passport.use(this.googleStrategy)

        this.router.get('/google',
            passport.authenticate('google', {scope: ['profile', 'email']})
        );

        this.router.get('/google/callback',
            passport.authenticate('google', {session: false}),
            this.oauthCallback
        )

        this.router.get(
            '/token/refresh',
            AuthorizeRefreshToken(this.authenticationService),
            this.generateNewToken
        );
        this.router.get(
            '/token/clear',
            this.logout
        );
    }

    oauthCallback = async (req: Request, res: Response) => {
        let user = req.user as User;
        user = await this.authenticationService.queries.getDetails.handle({id: user.id})
        if (!user) {
            throw new ForbiddenError("login again")
        }
        const payload: Payload = {id: user.id};
        const token = generateJWTToken(payload);
        const refreshToken = generateRefreshJWTToken(payload);
        const cookie: Cookie[] = [
            {
                key: "token",
                value: token,
            }, {
                key: "refreshToken",
                value: refreshToken,
            }
        ];
        new SuccessResponseWithCookies(res, cookie, {jwt: token, user}).send();
    };

    generateNewToken = async (req: Request, res: Response) => {
        let user = req.user as User;
        user = await this.authenticationService.queries.getDetails.handle({id: user.id})
        if (!user) {
            throw new ForbiddenError("login again")
        }
        const payload: Payload = {id: user.id};
        const token = generateJWTToken(payload);
        const cookie: Cookie[] = [
            {
                key: "token",
                value: token,
            }
        ];
        new SuccessResponseWithCookies(res, cookie, {jwt: token, user}).send();
    }

    logout = async (req: Request, res: Response) => {
        new SuccessResponseWithCookies(res, [], {message: "logged out"}).logout()
    }
}