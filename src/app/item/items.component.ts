import { Component, OnInit, ViewChild } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { DatabaseService } from "../services/sqlite.service";
import {TextField} from 'tns-core-modules/ui/text-field';

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    name: string = '';
    db: any;
    @ViewChild('itemTextField') itemTextField
    constructor(private itemService: ItemService, private database: DatabaseService) { }

    ngOnInit(): void {
        this.selectItems();
        // this.items = this.itemService.getItems();
    }

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

    addItem() {
        if (this.name.trim() === "") {
			alert("Enter a name");
			return;
		}

		let textField = <TextField>this.itemTextField.nativeElement;
		textField.dismissSoftInput();

		this.db.execSQL("INSERT INTO contacts (name) VALUES (?)", [this.name]).then(id => {
			this.items.unshift({ id: id, name: this.name });
			this.name = "";
		}, error => {
			alert('An error occurred while adding an item to your list.');
			this.name = "";
		});
    }
}
