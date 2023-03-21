import {makeAutoObservable} from "mobx";
import {HubConnection} from "@microsoft/signalr";

export default class Store {
    urlHistory: Array<string> = [];
    username: string = "";
    room: string = "";
    hubConnection: HubConnection | null = null;

    setHubConnection(hubConnection: HubConnection | null){
        this.hubConnection = hubConnection;
    };

    setRoom(room: string) {
        this.room = room;
    }

    setUsername(name: string) {
        this.username = name;
    };

    setUrlHistory(url: string) {
        this.urlHistory.push(url);
    };

    async postState(isPlaying: boolean, time: number,) {
        await this.hubConnection?.invoke("ChangeState", isPlaying, time);
    };

    async postChangeVideo(url: string) {
        await this.hubConnection?.invoke("ChangeVideo", url);
    }

    constructor() {
        makeAutoObservable(this);
    }
}