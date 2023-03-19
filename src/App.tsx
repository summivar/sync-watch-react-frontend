import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import PlayerPage from "./pages/PlayerPage";
const App : FC = ()  => {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/player" element={<PlayerPage />}/>
                    <Route path="*" element={<NotFoundPage />}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default observer(App);