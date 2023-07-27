import { database } from '../database/main.mjs';

export class overview {
    db = null;
    async init() {
        this.db = new database();
    }
}