import React, {FC, useContext, useEffect, useState} from 'react';
import '../styles/HomePage.css'
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const HomePage: FC = () => {
    const {store} = useContext(Context);
    const [user, setUsername] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    useEffect(()=>{
        store.setRoom(room);
        store.setUsername(user);
    },[user,room])
    return (
        <div className="App background-site">
            <span className="Greeting">
               Приветствую, {store.username}
            </span>
            <span>Текущая комната: {store.room}</span>
            <input placeholder="USERNAME" value={user} onChange={(e)=>{
                setUsername(e.target.value);
            }}/>
            <input placeholder="ROOM" value={room} onChange={(e)=>{
                setRoom(e.target.value)
            }}/>
        </div>
    );
};
export default observer(HomePage);