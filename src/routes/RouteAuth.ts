import { Config } from "~/Config.js";
import { IApplication } from "./IApplication.js";
import { Request, Response } from "express";
import got from "got";
import { UserEntity } from "~/database/UserEntity.js";
import JwtHelper from "~/JwtHelper.js";

export class RouteAuth {
    public static register(inst: IApplication) {
        const app = inst.app;
        const db = inst.db;

        app.get("/api/auth/id", (req: Request, res: Response) => {
            res.end(Config.instance.github.id);
        });
        app.post("/api/auth/login", async (req: Request, res: Response) => {
            res.set("Content-Type", "application/json");

            try {
                const code = req.query.code as string || '';

                // 请求GitHub获取access_token
                const tokenData = await got.post(`https://github.com/login/oauth/access_token`, {
                    form: {
                        code,
                        client_id: Config.instance.github.id,
                        client_secret: Config.instance.github.secret
                    },
                    headers: {
                        'Accept': 'application/json'
                    },
                    responseType: 'json'
                }).json<{ access_token: string }>();

                const accessToken = tokenData.access_token;

                let userResponse = await got(`https://api.github.com/user`, {
                    headers: {
                        'Authorization': `token ${accessToken}`,
                        'Accept': 'application/json',
                        'User-Agent': 'Open93AtHome-V3/3.0.0' // GitHub API要求设置User-Agent
                    }
                }).json<{ id: number, login: string, avatar_url: string, name: string }>();

                const githubUser = UserEntity.create(
                    userResponse.name || userResponse.login || '',
                    userResponse.avatar_url
                );

                // 处理数据库操作
                let dbUser = await db.getEntity<UserEntity>(UserEntity, githubUser.id);
                if (dbUser) {
                    dbUser.avatar = githubUser.avatar;
                    dbUser.name = githubUser.name;
                    await db.update<UserEntity>(UserEntity, dbUser);
                } else {
                    await db.insert<UserEntity>(UserEntity, githubUser);
                }

                // 生成JWT并设置cookie
                const token = JwtHelper.instance.issueToken({
                    userId: githubUser.id,
                    clientId: Config.instance.github.id
                }, "user", 60 * 60 * 24 * 2);

                res.cookie('dn42-autopeer-token', token, {

                });
                const user = await db.getEntity<UserEntity>(UserEntity, githubUser.id);
                res.status(200).json(user);
            } catch (error) {
                const err = error as Error;
                console.error('Error processing GitHub OAuth:', err);
                res.status(500).json({
                    error: `${err.name}: ${err.message}`
                });
            }
        });
    }
}