import { Express } from "express";
import { IDatabase } from "~/database/IDatabase.js";
import { RouteAuth } from "./RouteAuth.js";

export interface IApplication {
    app: Express;
    db: IDatabase;
}

export function register(app: IApplication) {
    RouteAuth.register(app);
}