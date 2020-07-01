import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Item } from "./item";
import {DbContract} from "../DbContract";

@Injectable({
    providedIn: "root"
})
export class ItemService {
    private items = new Array<Item>();
    constructor(private http: HttpClient) { }
    getItems(): Array<Item> {
        return this.items;
    }

    getItem(id: number): Item {
        return this.items.filter((item) => item.id === id)[0];
    }

    addItemToServer(name) {
        let options = this.createRequestOptions();
        return this.http.get(DbContract.SERVER_URL+'?name='+name, { headers: options });
    }
    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
}
