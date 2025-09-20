import type AuthenticationService from "../../../services/authentication";
import {type Request, type Response, Router} from "express";
import {BadRequestError, ForbiddenError} from "../../../../packages/errors";
import {SuccessResponse, SuccessResponseWithCookies} from "../../../../packages/responses/success.ts";
import type {User} from "../../../domain/user";
import type AppSecrets from "../../../../packages/secret";
import {Authorize, AuthorizeEmailToken} from "../middlewares/authorization.ts";
import ValidationMiddleware from "../middlewares/validation.ts";
import {z} from "zod";

export default class ProfileHandler {
    authenticationService: AuthenticationService
    appSecret: AppSecrets
    router = Router()

    constructor(authenticationService: AuthenticationService, appSecret: AppSecrets) {
        this.authenticationService = authenticationService
        this.appSecret = appSecret

        this.configureRoutes()
    }

    private configureRoutes() {
        this.router.patch('/username',
            ValidationMiddleware(z.object({
                username: z.string().min(3),
            }), "body"),
            Authorize(this.authenticationService),
            this.updateUsername
        );

        this.router.patch('/password/change',
            ValidationMiddleware(z.object({
                oldPassword: z.string(),
                newPassword: z.string().min(8).max(128),
            }), "body"),
            Authorize(this.authenticationService),
            this.changePassword
        );

        this.router.patch('/password/reset',
            ValidationMiddleware(z.object({
                password: z.string().min(8).max(128),
            }), "body"),
            AuthorizeEmailToken(this.authenticationService),
            this.resetPassword
        );

        this.router.post('/password/forgot',
            ValidationMiddleware(z.object({
                email: z.email(),
            }), "body"),
            this.forgotPassword
        );

        this.router.patch('/email/verify',
            AuthorizeEmailToken(this.authenticationService),
            this.verifyEmail
        );

        this.router.post('/email/verify/resend',
            ValidationMiddleware(z.object({
                email: z.email(),
            }), "body"),
            this.resendVerificationEmail
        );

    }

    updateUsername = async (req: Request, res: Response) => {
        let user = req.user as User;
        let {username} = req.body;
        if (!username) throw new BadRequestError("provide username")
        await this.authenticationService.commands.addUsername.handle(user.id, username)

        new SuccessResponse(res, {message: "username added"}).send()
    }

    verifyEmail = async (req: Request, res: Response) => {
        let user = req.user as User;
        await this.authenticationService.commands.verifyEmail.handle(user.id)

        new SuccessResponse(res, {message: "email verified"}).send()
    }

    resendVerificationEmail = async (req: Request, res: Response) => {
        let {email} = req.body;
        if (!email) throw new BadRequestError("provide email")
        await this.authenticationService.commands.resendVerificationEmail.handle(email)
        new SuccessResponse(res, {message: "verification email sent"}).send()
    }

    forgotPassword = async (req: Request, res: Response) => {
        let {email} = req.body;
        if (!email) throw new BadRequestError("provide email")
        await this.authenticationService.commands.forgotPassword.handle(email)
        new SuccessResponse(res, {message: "reset password email sent"}).send()
    }

    resetPassword = async (req: Request, res: Response) => {
        let user = req.user as User;
        let {password} = req.body;
        if (!password) throw new BadRequestError("provide password")
        await this.authenticationService.commands.resetPassword.handle(user.id, password)
        new SuccessResponse(res, {message: "password reset"}).send()
    }

    changePassword = async (req: Request, res: Response) => {
        let user = req.user as User;
        let {oldPassword, newPassword} = req.body;
        if (!oldPassword || !newPassword) throw new BadRequestError("provide both old and new passwords")
        await this.authenticationService.commands.changePassword.handle(user.id, oldPassword, newPassword)
        new SuccessResponse(res, {message: "password changed"}).send()
    }
}