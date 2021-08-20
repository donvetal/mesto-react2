import React from "react";
import logo from "../images/header-logo.svg";

function Header() {
    return (
        <header className="header page__container">
            <img src={logo} alt="логотип" className="header__logo"/>
        </header>
    );
}

export default Header;