import React, {FC, useContext, useState} from 'react';
import {Link} from "react-router-dom";
import './Navbar.css';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const Navbar: FC = () => {
    const {store} = useContext(Context);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const handleClick = () => {
        setOpenMenu(!openMenu);
    };
    const closeMenu = () => {
        setOpenMenu(false);
    };
    const disconnectFromServer = () => {
        store.hubConnection?.stop();
        store.setHubConnection(null);
    }
    return (
        <div>
            <nav className="navbar">
                <Link to="/" className="nav-logo">
                    Test Pink App
                </Link>
                <div onClick={handleClick} className="nav-icon">
                    {openMenu ? <span>Menu</span> : <span style={{fontSize: "calc(10px + 2vmin)"}}>Menu</span>}
                </div>
                <ul className={openMenu ? 'nav-links active' : 'nav-links'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={closeMenu}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/player" className="nav-link" onClick={closeMenu}>
                            Player
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default observer(Navbar);