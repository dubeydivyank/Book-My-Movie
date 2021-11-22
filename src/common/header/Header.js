import React, { useState } from "react";
import "./Header.css";
import Logo from "../../assets/logo.svg";

const Header = () => {
	return (
		<div>
			<div className="header">
				<img className="logo" src={Logo} alt="logo" />
			</div>
		</div>
	);
};

export default Header;
