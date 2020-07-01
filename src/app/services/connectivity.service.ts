import { Injectable } from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ConnectivityService {
    private network_info;
    public networkChange$ = new BehaviorSubject<boolean>(true);
    constructor() {}

    public getNetworkInfo() {
        return this.network_info;
    }

    public setNetworkInfo(network_info) {
        this.network_info = network_info;
    }
}