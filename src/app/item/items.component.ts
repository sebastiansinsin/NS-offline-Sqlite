import { Component, OnInit, ViewChild } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { DatabaseService } from "../services/sqlite.service";
import { TextField } from 'tns-core-modules/ui/text-field';
import { ConnectivityService } from "../services/connectivity.service";
import { DbContract } from "../DbContract";
import { takeUntil } from 'rxjs/operators';
import { Subject } from "rxjs";

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    name: string = '';
    db: any;
    @ViewChild('itemTextField') itemTextField;
    private ngUnsubscribe = new Subject();
    constructor(private itemService: ItemService, private database: DatabaseService, private connectivityService: ConnectivityService) {
        this.db = this.database.initializeDatabase();
    }

    ngOnInit(): void {
        this.readFromLocalStorage();
        this.connectivityService.networkChange$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            value => {
                console.log('network changes', value);
                if (value) {
                    console.log('why is not working?');
                    this.database.readUnsyncFromLocalDatabase(this.db).then(
                        rows => {
                            for (var row in rows) {
                                console.log('read unsync rows', rows[row][1], rows[row][2]);
                                // this.database.updateLocalDatabase(rows[row][1], DbContract.SYNC_STATUS_OK, this.db);
                                this.itemService.addItemToServer(rows[row][1]).subscribe(
                                    (res: any) => {
                                        if (res.status === 'OK') {
                                            this.database.updateLocalDatabase(rows[row][1], DbContract.SYNC_STATUS_OK, this.db);
                                        }
                                    }
                                );
                            }
                        }
                    ).finally(() => { this.readFromLocalStorage(); });
                }
            }
        );

        // this.selectItems();
        // this.items = this.itemService.getItems();
    }

    private readFromLocalStorage() {
        this.items = [];
        this.database.readFromLocalDatabase(this.db).then(
            rows => {
                for (var row in rows) {
                    console.log('items', rows[row][1], rows[row][2])
                    this.items.push({ id: rows[row][0], name: rows[row][1], sync_status: rows[row][2] });
                }
            }
        );
    }

    private saveToAppServer(name) {
        const network_status = this.connectivityService.getNetworkInfo();
        console.log('network status', network_status);
        if (network_status) {
            this.itemService.addItemToServer(name).subscribe(
                (res: any) => {
                    const result = res;
                    console.log('hit API', result);
                    if (result.status === 'OK') {
                        this.saveToLocalStorage(name, DbContract.SYNC_STATUS_OK);
                    }
                    else {
                        alert('save error');
                        this.saveToLocalStorage(name, DbContract.SYNC_STATUS_FAILED);
                    }
                },
                err => {
                    console.log('hit API error', err);
                    alert('save error');
                    this.saveToLocalStorage(name, DbContract.SYNC_STATUS_FAILED);
                }
            );
        }
        else {
            this.saveToLocalStorage(name, DbContract.SYNC_STATUS_FAILED);
        }

    }

    private saveToLocalStorage(name: string, sync_status: number) {
        this.database.saveToLocalDatabase(name, sync_status, this.db);
        this.readFromLocalStorage();
    }

    /** 
    selectItems() {
        this.items = [];
        this.database.getdbConnection()
			.then(db => {
				db.all("SELECT id, name FROM contacts").then(rows => {
					for (var row in rows) {
						this.items.push({ id: rows[row][0], name: rows[row][1] });
					}
					this.db = db;
				}, error => {
					console.log("SELECT ERROR", error);
				});
			});
    }
    */

    public addItem(name) {
        if (name.trim() === "") {
            alert("Enter a name");
            return;
        }

        let textField = <TextField>this.itemTextField.nativeElement;
        textField.dismissSoftInput();

        this.saveToAppServer(name);
        this.name = '';
        /** 
		this.db.execSQL("INSERT INTO contacts (name) VALUES (?)", [this.name]).then(id => {
			this.items.unshift({ id: id, name: this.name });
			this.name = "";
		}, error => {
			alert('An error occurred while adding an item to your list.');
			this.name = "";
        });
        */
    }
}
