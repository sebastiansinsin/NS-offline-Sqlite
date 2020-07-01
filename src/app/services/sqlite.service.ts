import { Injectable } from "@angular/core";
import {DbContract} from "../DbContract";

var Sqlite = require("nativescript-sqlite");
@Injectable()
export class DatabaseService  {
    private static DATABASE_VERSION = 1;
    private static CREATE_TABLE = "create table IF NOT EXISTS "+DbContract.TABLE_NAME+"(id integer primary key autoincrement,"+DbContract.NAME+" text,"+DbContract.SYNC_STATUS+" integer);";
    private static DROP_TABLE = "drop table if exists "+DbContract.TABLE_NAME;
    constructor() {}

    /** 
    getdbConnection() {
        return new Sqlite('contacts');
    }
    closedbConnection() {
        new Sqlite('contacts')
            .then((db) => {
                db.close();
            });
    }
    */

    /** following tutorial from android native */
    public initializeDatabase() : Promise<any> {
        return new Sqlite(DbContract.DATABASE_NAME);
    }
    public onCreate(db: Promise<any>) {
        db.then(
            db => db.execSQL(DatabaseService.CREATE_TABLE)
        );
    }
    public onUpgrade(db: Promise<any>) {
        db.then(
            db => db.execSQL(DatabaseService.CREATE_TABLE)
        );
        this.onCreate(db);
    }

    public saveToLocalDatabase(name:string, sync_status:number,db: Promise<any>) {
        const insert_query = `INSERT INTO ${DbContract.TABLE_NAME} (${DbContract.NAME},${DbContract.SYNC_STATUS}) VALUES (?, ?)`;
        db.then(
            db => db.execSQL(insert_query, [name, sync_status])
        );
    }

    public readFromLocalDatabase(db: Promise<any>) : Promise<any> {
        const read_query = `SELECT id, ${DbContract.NAME}, ${DbContract.SYNC_STATUS} FROM ${DbContract.TABLE_NAME}`;
        return db.then(
            db => {return db.all(read_query)}
        );
    }

    public updateLocalDatabase(name:string, sync_status:number, db: Promise<any>) {
        const update_query = `UPDATE ${DbContract.TABLE_NAME} SET ${DbContract.SYNC_STATUS}=${sync_status} WHERE ${DbContract.NAME}='${name}'`;
        db.then(
            db => db.execSQL(update_query)
        );
    }

    public readUnsyncFromLocalDatabase(db:Promise<any>) : Promise<any> {
        const read_query = `SELECT id, ${DbContract.NAME}, ${DbContract.SYNC_STATUS} FROM ${DbContract.TABLE_NAME} WHERE ${DbContract.SYNC_STATUS}=${DbContract.SYNC_STATUS_FAILED}`;
        return db.then(
            db => {return db.all(read_query)}
        );
    }
}