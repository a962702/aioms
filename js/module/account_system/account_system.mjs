import { database } from '../database/main.mjs';

export class account_system {
    db = null;
    async init() {
        this.db = new database();
    }
}