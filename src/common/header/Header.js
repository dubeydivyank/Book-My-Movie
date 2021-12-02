import React, { useState, useEffect } from "react";
import "./Header.css";
import Logo from "../../assets/logo.svg";
import { Button } from "@material-ui/core";
import Modal from "react-modal";
import { Tab } from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Link } from "react-router-dom";

// TABPANEL FROM MATERIAL UI
function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Typography component="span">{children}</Typography>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

// CUSTOM STYLES FOR LOGIN/REGISTER MODAL
const modalStyle = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

//     HEADER FUNCTION
export default function Header(props) {
	const [IsUserLoggedIn, setIsUserLoggedIn] = useState(false);
	useEffect(() => {
		const accessToken = sessionStorage.getItem("access-token");
		if (accessToken) {
			setIsUserLoggedIn(true);
		}
	}, []);

	const [isOpen, setIsOpen] = useState(false);
	const updateLoginStatus = (loggedIn) => {
		setIsUserLoggedIn(loggedIn);
		if (isOpen) {
			openOrCloseModal();
		}
	};

	function openOrCloseModal() {
		setIsOpen(!isOpen);
	}

	const [tabValue, setTabValue] = React.useState(0);
	const handleTabValueChange = (event, newValue) => {
		setTabValue(newValue);
	};

	function handleLogoutRequest() {
		const logoutRequest = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: "Bearer " + sessionStorage.getItem("access-token"),
			},
		};
		fetch("/api/v1/auth/logout", logoutRequest).then((response) => {
			if (response.status === 200) {
				sessionStorage.removeItem("access-token");
				updateLoginStatus(false);
			} else {
				console.log("Invalid access token");
			}
		});
	}

	/**
	 *
	 *
	 *
	 */
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleLoginRequest(e) {
		e.preventDefault();
		const userCredentials = window.btoa(username + ":" + password);
		const loginRequest = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				authorization: "Basic " + userCredentials,
			},
		};
		fetch("/api/v1/auth/login", loginRequest)
			.then((response) => {
				if (!response.ok) {
					return response.json();
				}
				return response;
			})
			.then((response) => {
				if (response.headers) {
					sessionStorage.setItem(
						"access-token",
						response.headers.get("access-token")
					);
					updateLoginStatus(true);
				} else {
					console.log(response.body);
				}
			});
	}
	/*
                    

   */

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [contactNo, setContactNo] = useState("");
	const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState();

	function handleRegistrationRequest(e) {
		e.preventDefault();
		const userDetails = {
			email_address: email,
			first_name: firstName,
			last_name: lastName,
			mobile_number: contactNo,
			password: password,
		};
		const signupRequest = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(userDetails),
		};
		fetch("/api/v1/signup", signupRequest)
			.then((response) => response.json())
			.then((response) => {
				if (response.id) {
					setRegistrationSuccessMsg("Registration successful. Please login!");
				} else {
					setRegistrationSuccessMsg(response.message);
				}
			});
	}

	return (
		<div>
			<div className="header">
				<img className="logo" src={Logo} alt="logo" />

				{IsUserLoggedIn ? (
					<Button
						variant="contained"
						color="default"
						style={{ float: "right" }}
						onClick={handleLogoutRequest}
					>
						Logout
					</Button>
				) : (
					<Button
						variant="contained"
						color="default"
						style={{ float: "right" }}
						onClick={openOrCloseModal}
					>
						Login
					</Button>
				)}

				{props.movieId !== undefined ? (
					<span>
						<Link to={"/BookShow/" + props.movieId}>
							<Button
								variant="contained"
								color="primary"
								style={{ float: "right", marginRight: "12px" }}
							>
								BOOK SHOW
							</Button>
						</Link>
					</span>
				) : (
					""
				)}

				<Modal
					isOpen={isOpen}
					onRequestClose={openOrCloseModal}
					contentLabel="Login-Register Modal"
					style={modalStyle}
					centered
				>
					<Tabs value={tabValue} onChange={handleTabValueChange}>
						<Tab label="Login" {...a11yProps(0)} />
						<Tab label="Register" {...a11yProps(1)} />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						<div style={{ textAlign: "center" }}>
							<form
								id="login-form"
								className="login-register-form"
								onSubmit={(e) => {
									handleLoginRequest(e);
								}}
							>
								<FormControl required>
									<InputLabel htmlFor="userName">Username</InputLabel>
									<Input
										id="username"
										value={username}
										onChange={({ target }) => setUsername(target.value)}
									/>
								</FormControl>
								<br />
								<FormControl required>
									<InputLabel htmlFor="password">Password</InputLabel>
									<Input
										id="password"
										value={password}
										onChange={({ target }) => setPassword(target.value)}
										type="password"
									/>
								</FormControl>
								<br />
								<br />
								<Button
									type="submit"
									variant="contained"
									color="primary"
									style={{ float: "center" }}
								>
									LOGIN
								</Button>
							</form>
						</div>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						<div style={{ textAlign: "center" }}>
							<form
								id="register-form"
								className="login-register-form"
								onSubmit={(e) => {
									handleRegistrationRequest(e);
								}}
							>
								<FormControl required={true}>
									<InputLabel htmlFor="first-name">First Name</InputLabel>
									<Input
										id="first-name"
										value={firstName}
										onChange={({ target }) => setFirstName(target.value)}
									/>
								</FormControl>
								<br />
								<FormControl required={true}>
									<InputLabel htmlFor="last-name">Last Name</InputLabel>
									<Input
										id="last-name"
										value={lastName}
										onChange={({ target }) => setLastName(target.value)}
									/>
								</FormControl>
								<br />
								<FormControl required={true}>
									<InputLabel htmlFor="email-address">Email</InputLabel>
									<Input
										id="email-address"
										value={email}
										onChange={({ target }) => setEmail(target.value)}
									/>
								</FormControl>
								<br />
								<FormControl required={true}>
									<InputLabel htmlFor="new-password">Password</InputLabel>
									<Input
										id="new-password"
										type="password"
										value={password}
										onChange={({ target }) => setPassword(target.value)}
									/>
								</FormControl>
								<br />
								<FormControl required={true}>
									<InputLabel htmlFor="contact-no">Contact No.</InputLabel>
									<Input
										id="contact-no"
										value={contactNo}
										onChange={({ target }) => setContactNo(target.value)}
									/>
								</FormControl>
								<br />
								<br />
								<span>{registrationSuccessMsg}</span>
								<br />
								<br />
								<Button
									variant="contained"
									color="primary"
									style={{ float: "center" }}
									type="submit"
								>
									REGISTER
								</Button>
							</form>
						</div>
					</TabPanel>
				</Modal>
			</div>
		</div>
	);
}
