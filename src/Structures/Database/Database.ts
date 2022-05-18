import { readdir, stat } from "fs/promises";
import { 
    Connection, 
    Schema, 
    Model,
    createConnection 
} from "mongoose";
import {
    join
} from "path";
import { Logger } from "winston";

export default class Database {
    connection: Connection = createConnection(); 
    models: Map<string, Model<any>> = new Map;

    constructor(public logger?: Logger) {}
    async scan(dir: string): Promise<void> {
        const { 
            logger, 
            connection,
            models
        } = this;

        logger?.info(`Scanning dir ${dir}`);

        for (const file of await readdir(dir)) {
            const path = join(dir, file);
            const info = await stat(path);

            if (info.isDirectory()) {
                logger?.info(`Found dir ${path}`);
                await this.scan(path);
            } else {
                logger?.info(`Found file ${path}`);
                
                const imported = require(path) as {
                    schema: Schema;
                    name?: string;
                };

                imported.name = imported.name || file.split(".")[0];

                const { name, schema } = imported;

                models.set(name, connection.model(name, schema));
                logger?.info(`Imported file ${path} (${name})`);
            }
        }

        logger?.info(`Finished scanning dir ${dir}`);
    }
    clear(): void {
        const { models, logger } = this;

        for (const k of models.keys()) delete models[k];

        this.models = new Map;

        logger.info(`Removed all models`);
    }
    async connect(uri: string): Promise<Connection> {
        const { logger, connection } = this;
        
        await connection.openUri(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        logger.info(`Connected`);

        return connection;
    }
    get(name: string): Model<any> {
        return this.models.get(name) as Model<any>;
    }
};