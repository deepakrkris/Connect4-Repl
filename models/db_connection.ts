import "reflect-metadata"
import { DataSource } from "typeorm"
import { User , Game } from "../models/index.js"
import path from 'path';

const __dirname = path.resolve();
export const root: string = path.resolve(__dirname, "..")

let AppDataSource = new DataSource({
    url: process.env.DATABASE_URL || `postgres://thangarajamohan:myPassword@localhost:5432/postgres`,
    type: "postgres",
    synchronize: true,
    entities: [ User, Game ],
})

if (process.env.MOCK_DB) {
    AppDataSource = new DataSource({
        type: "sqlite",
        database: `${root}/data/line.sqlite`,
        entities: [ User , Game ],
        synchronize: true,
        logging: false,
    })
}

AppDataSource.initialize();

export async function init() {
}

export function getQueryRunner() {
    return AppDataSource.createQueryRunner();
}

export function getQueryBuilder() {
    return AppDataSource.createQueryBuilder();
}

export function getEntityManager() {
    return AppDataSource.createEntityManager();
}
