import { Component, OnInit, NgZone } from "@angular/core";
import { DatabaseService } from "./services/sqlite.service";
import * as Connectivity from "tns-core-modules/connectivity";
import { ConnectivityService } from "./services/connectivity.service";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    private connection_status;
    private db : Promise<any>;
    constructor(private database: DatabaseService, private connectivityService: ConnectivityService) {

        /**following tutorial from android native */
        this.db = this.database.initializeDatabase();
        this.database.onCreate(this.db);


        /** 
        this.database.getdbConnection()
            .then(db => {
                db.execSQL("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, syncstatus INTEGER)").then(() => {
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            });
        */
    }
    public ngOnInit() {
        this.connection_status = this.checkNetworkConnection(Connectivity.getConnectionType());
        this.connectivityService.setNetworkInfo(this.connection_status);

        Connectivity.startMonitoring(connectionType => {
            this.connection_status = this.checkNetworkConnection(connectionType);
            this.connectivityService.setNetworkInfo(this.connection_status);
            this.connectivityService.networkChange$.next(this.connection_status);
        });
    }
    public checkNetworkConnection(connectionType: number): boolean {
        switch (connectionType) {
            case Connectivity.connectionType.none:
                return false;
            case Connectivity.connectionType.wifi:
                return true;
            case Connectivity.connectionType.mobile:
                return true;
            default:
                return false;
        }
    }
}
