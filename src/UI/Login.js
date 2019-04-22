import React, {Component} from 'react';
import { Redirect, Link } from "react-router-dom";
import Auth from '../utils/auth';
import '../styles/Login.scss';

export default class Login extends Component {
	constructor(props) {
		super(props);
		const loggedIn = Auth.authenticate();
		this.state = {
			userName: "",
			password: "",
			rememberMe: false,
			loggedIn
		};
		this.userNameChange = this.userNameChange.bind(this);
		this.passwordChange = this.passwordChange.bind(this);
		this.login = this.login.bind(this);
	}

	userNameChange(e) {
		this.setState({userName: e.target.value});
	}

	passwordChange(e) {
		this.setState({password: e.target.value});
	}

	async login(e) {
		e.preventDefault();
		try {
			const reqData = {
				password: this.state.password,
				email: this.state.userName
			};
			await Auth.login(reqData);
			this.setState({loggedIn: true});
		} catch(err) {
			console.log("Error in logging in: ", err);
			alert(err.message);
		}
	}

	render() {
		if(this.state.loggedIn) {
			return <Redirect to='/' />
		} else {
			return (
                <section className="login__register">

					<div className="backgorund-animation">
					</div>
					<form onSubmit={this.login} autoComplete="on">
					<div style={{fontSize : '40px', textAlign : 'center', fontFamily : 'sans-serif'}}><b>CHAT DEMO</b></div>

						<div className="login__register--leftconversation">
							<input type="email" onChange={this.userNameChange} placeholder="Login id"/>
							<input type="password" onChange={this.passwordChange} placeholder="Password"/>
						</div>
						<button type="submit">LOGIN</button>
						<span className="login__register--leftconversation">Not registered? <Link to="/register">Create an account</Link></span>
					</form>
					<div className="backgorund-animation">
					</div>
				</section>
			);
		}
	}
}