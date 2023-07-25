import { database } from '../../database/main.mjs';

class account_system {
    db = null;
    async init() {
        this.db = new database();
    }
}