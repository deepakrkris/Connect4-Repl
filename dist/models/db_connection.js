var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Game } from "../models/index.js";
import path from 'path';
const __dirname = path.resolve();
export const root = path.resolve(__dirname, "..");
const AppDataSource = new DataSource({
    type: "sqlite",
    database: `${root}/data/line.sqlite`,
    entities: [User, Game],
    synchronize: true,
    logging: false,
});
AppDataSource.initialize();
export function init() {
    return __awaiter(this, void 0, void 0, function* () {
    });
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
