import "reflect-metadata"
import { DataSource, QueryBuilder, QueryRunner } from "typeorm"
import { User , Game } from "../models/index.js"
import path from 'path';

const __dirname = path.resolve();
export const root: string = path.resolve(__dirname, "..")

// eg : postgres://{user}:{pass}@localhost:5432/postgres
const DATABASE_URL = process.env.DATABASE_URL

console.log("DATABASE_URL " , DATABASE_URL)

let AppDataSource = null;

if (DATABASE_URL) {
    AppDataSource = new DataSource({
        url: DATABASE_URL,
        type: "postgres",
        synchronize: true,
        entities: [ User, Game ],
        logging: false,
    })
} else {
    AppDataSource = new DataSource({
        type: "sqlite",
        database: `${root}/data/line.sqlite`,
        entities: [User , Game],
        synchronize: true,
        logging: false,
    })
}

export async function init() {
    AppDataSource.initialize();
}

export function getQueryRunner() : QueryRunner {
    return AppDataSource.createQueryRunner();
}

export function getQueryBuilder<T>() : QueryBuilder<T> {
    return AppDataSource.createQueryBuilder();
}

export function getEntityManager() {
    return AppDataSource.createEntityManager();
}
