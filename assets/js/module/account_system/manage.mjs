import { database } from '../database/main.mjs';

export class manage {
    db = null;
    async init() {
        this.db = new database();
        await this.db.init();
    }
}