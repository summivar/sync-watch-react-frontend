import React, {useContext, useEffect, useRef, useState} from 'react';
import ReactPlayer from "react-player";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {API_HUB} from "../http";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Navigate} from "react-router-dom";
import {IConnection} from "@microsoft/signalr/dist/esm/IConnection";

interface IResponseState {
    isPlaying: boolean;
    time: number;
}

const SyncVideoPlayer = () => {
    const {store} = useContext(Context);
    const playerRef = useRef<ReactPlayer>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [urlValue, setUrlValue] = useState<string>('');
    const [currentUrl, setCurrentUrl] = useState<string>("https://www.youtube.com/watch?v=xXgV8SdgcZI");
    const [stateFromServer, setStateFromServer] = useState<boolean>(false);

    useEffect(() => {
        createHubConnection(`${store.username}`, `${store.room}`).then();
    });
    const createHubConnection = async (user: string, room: string) => {
        if (user === '' || room === '') {
            console.log("Not valid room or user");
            return;
        }
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(API_HUB)
                .withAutomaticReconnect()
                .build();
            connection.onclose((e) => {
                store.setHubConnection(null);
            });
            await connection.start();
            await connection.invoke("JoinRoom", {user, room});
            store.setHubConnection(connection);
        } catch (e) {
            console.log(e);
        }
    };
    const handleChangeState = (isPlaying: boolean, time: number) => {
        setStateFromServer(true);
        playerRef.current?.seekTo(time);
        setIsActive(isPlaying);
    }
    useEffect(() => {
        if (store.hubConnection) {
            store.hubConnection.on("ReceiveMessage", (message) => {
                console.log("MESSAGE " + message);
            });
            store.hubConnection.on("ChangeState", (response: IResponseState) => {
                const {isPlaying, time} = response;
                handleChangeState(isPlaying, time);
            });
            store.hubConnection.on("NewVideo", (response: string) => {
                setCurrentUrl(response);
            });
        }
    }, [store.hubConnection]);
    useEffect(() => {
       const postState = async () => {
           const time: number = Number(playerRef.current?.getCurrentTime());
           await store.postState(isActive,time);
       }
       postState().catch(e => console.log(e));
    }, [isActive])
    const handleChangeVideo = async () => {
        if (store.hubConnection) {
            await store.postChangeVideo(urlValue);
            setUrlValue('');
        }
    };
    return (
        <>
            <div>
                <label className="textWhite">Выйти из комнаты</label>
                <button
                    style={{
                        marginLeft: "5px",
                        border: "none",
                        backgroundColor: "red",
                        color: "white",
                        fontSize: "25px"
                    }}
                    onClick={() => {
                        store.hubConnection?.stop();
                        store.setHubConnection(null);
                        return <Navigate to="/"/>
                    }}
                >
                    Тык
                </button>
            </div>
            <input style={{margin: "2px"}} value={urlValue} onChange={(e) => {
                setUrlValue(e.target.value);
            }}/>
            <button style={{margin: "2px"}} onClick={async () => {
                store.setUrlHistory(urlValue);
                await handleChangeVideo();
            }}>Сменить видео
            </button>
            <ReactPlayer
                width="350"
                height="350"
                url={currentUrl}
                ref={playerRef}
                controls={true}
                playing={isActive}
                onPlay={async () => {
                    setIsActive(true)
                }}
                onPause={async () => {
                    setIsActive(false)
                }}
                onSeek={async ()=>{
                    console.log('hello');
                }}
            />
        </>
    );
};

export default observer(SyncVideoPlayer);