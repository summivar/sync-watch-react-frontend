import React, {useContext, useEffect, useRef, useState} from 'react';
import ReactPlayer from "react-player";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {API_HUB} from "../http";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const SyncVideoPlayer = () => {
    const {store} = useContext(Context);
    const playerRef = useRef<ReactPlayer>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hubConnection, setHubConnection] = useState<HubConnection | null>();
    const [urlValue, setUrlValue] = useState<string>('');
    const [currentUrl, setCurrentUrl] = useState<string>("https://www.youtube.com/watch?v=xXgV8SdgcZI");
    const [isDataFromServer, setIsDataFromServer] = useState<boolean>(false);

    useEffect(() => {
        createHubConnection(`${store.username}`,`${store.room}`).then(() => console.log(`TRY CONNECT WITH USER NAME => ${store.username} and room => ${store.room}`));
    }, []);
    const createHubConnection = async (user: string, room: string) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(API_HUB, {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                .withAutomaticReconnect()
                .build();
            connection.onclose((e)=>{
                setHubConnection(null);
            });
            await connection.start();
            await connection.invoke("JoinRoom", {user, room});
            setHubConnection(connection);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        if (hubConnection) {
            hubConnection.on("ReceiveMessage", (message: string) => {
                console.log(message);
            });
            hubConnection.on("PauseState", (response: boolean) => {
                setIsDataFromServer(true);
                setIsPlaying(response);
            });
            hubConnection.on("TimeState", (response: number) => {
                playerRef.current?.seekTo(response);
            });
            hubConnection.on("NewVideo", (response: string) => {
                setCurrentUrl(response);
            });
        }
    }, [hubConnection]);
    const handleSeek = async () => {
        if(hubConnection){
            await store.postSync(Number(playerRef.current?.getCurrentTime()), hubConnection);
        };
    };
    const handlePlay = async () => {
        if(hubConnection){
            if(!isDataFromServer){
                await store.postPlaying(true, hubConnection);
                setIsDataFromServer(false);
                return;
            }
            setIsDataFromServer(false);
        };
    };
    const handlePause = async () => {
        if(hubConnection){
            if(!isDataFromServer){
                await store.postPlaying(false, hubConnection);
                await handleSeek();
                setIsDataFromServer(false);
                return;
            }
            setIsDataFromServer(false);
        }
    };
    const handleChangeVideo = async () => {
        if(hubConnection){
            await store.postChangeVideo(urlValue, hubConnection);
            setUrlValue('');
        }
    };
    return (
        <>
            <input style={{margin: "2px"}} value={urlValue} onChange={(e) => {
                setUrlValue(e.target.value);
            }}/>
            <button style={{margin: "2px"}} onClick={async () => {
                store.setUrlHistory(urlValue);
                await handleChangeVideo();
            }}>Сменить видео</button>
            <ReactPlayer
                url={currentUrl}
                ref={playerRef}
                controls={true}
                playing={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onSeek={handleSeek}
            />
        </>
    );
};

export default observer(SyncVideoPlayer);