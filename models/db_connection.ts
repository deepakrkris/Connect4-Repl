import "reflect-metadata"
import { DataSource } from "typeorm"
import { User , Game } from "../models/index.js"
import path from 'path';

const __dirname = path.resolve();
export const root: string = path.resolve(__dirname, "..")

const AppDataSource = new DataSource({
    type: "sqlite",
    database: `${root}/data/line.sqlite`,
    entities: [User , Game],
    synchronize: true,
    logging: false,
})

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
