import {makeAutoObservable} from "mobx";
import {HubConnection} from "@microsoft/signalr";

export default class Store {
    urlHistory: Array<string> = [];
    username: string = "";
    room: string = "";

    setRoom(room: string){
        this.room = room;
    }

    setUsername(name: string) {
        this.username = name;
    };

    setUrlHistory(url: string) {
        this.urlHistory.push(url);
    };

    async postPlaying(b: boolean, hubConnection: HubConnection) {
        await hubConnection.invoke("PlayingVideo", b);
    };

    async postSync(sec: number, hubConnection: HubConnection) {
        await hubConnection.invoke("RewindVideo", sec);
    };

    async postChangeVideo(url: string, hubConnection: HubConnection) {
        await hubConnection.invoke("ChangeVideo", url);
    }

    constructor() {
        makeAutoObservable(this);
    }
}