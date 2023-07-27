import { database } from '../database/main.mjs';

export class plan {
    db = null;
    async init() {
        this.db = new database();
    }
}