export interface Item {
    id: number;
    name: string;
}

export enum DbContract {
    sync_status_failed = 0,
    sync_status_ok,
}
