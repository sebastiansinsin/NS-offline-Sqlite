import { Injectable } from "@angular/core";
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class DatabaseService  {
    constructor() {}
    getdbConnection() {
        return new Sqlite('contacts');
    }
    closedbConnection() {
        new Sqlite('contacts')
            .then((db) => {
                db.close();
            });
    }
}