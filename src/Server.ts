import express, { Express } from 'express';
import { MySqlHelper } from '~/database/MySqlHelper.js';
import { Config } from '~/Config.js';
import { IDatabase } from '~/database/IDatabase.js';
// @ts-ignore
await import('express-async-errors');

class Server {
    private app: Express;
    private db: IDatabase;

    public constructor() {
        this.app = express();
        this.db = new MySqlHelper(
            Config.instance.database.host,
            Config.instance.database.port,
            Config.instance.database.user,
            Config.instance.database.password,
            Config.instance.database.database
        );
    }

    public async init(): Promise<void> {
        if (this.db instanceof MySqlHelper) this.db.init();

        // 注册（动词）表（名词）
        // await this.db.createTable<>
        
    }
}