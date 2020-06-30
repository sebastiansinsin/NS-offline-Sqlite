import { Component } from "@angular/core";
import { DatabaseService } from "./services/sqlite.service";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent {
    constructor(private database: DatabaseService) {
        this.database.getdbConnection()
            .then(db => {
                db.execSQL("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)").then(() => {
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            });
    }
}
