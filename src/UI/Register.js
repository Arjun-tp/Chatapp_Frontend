import React, {Component} from 'react';
import { Redirect, Link } from "react-router-dom";
import Auth from '../utils/auth';
// import './css/login.scss';

export default class Register extends Component {
	constructor(props) {
		super(props);
		const loggedIn = Auth.authenticate();
		this.state = {
			name: "",
			email: "",
			password: "",
			reEnterPassword: "",
			rememberMe: false,
			loggedIn
		};
		this.register = this.register.bind(this);
	}

	async register(e) {
		e.preventDefault();
		try {
			const reqData = {
				name: this.state.name,
				password: this.state.password,
				email: this.state.email
			};
			await Auth.register(reqData);
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
						{/* <img className="login__register--leftanime" src={require("../assets/left_conversation.png")} /> */}
					</div>
					<form onSubmit={this.register} autoComplete="on" >
						<div className="login__register--leftconversation">
							<input type="text" onChange={(e) => this.setState({name: e.target.value})} placeholder="Full Name" name="name" />
							<input type="email" onChange={(e) => this.setState({email: e.target.value})} placeholder="Login ID" name="email" />
							<input type="password" onChange={(e) => this.setState({password: e.target.value})} placeholder="Password" name="password" />
						</div>
						<button type="submit" >REGISTER</button>
						<span className="login__register--leftconversation">Already registered? <Link to="login">Login</Link></span>
					</form>
					<div className="backgorund-animation">
						{/* <img className="login__register--rightanime" src={require("../assets/right_conversation.png")} /> */}
					</div>
				</section>
			);
		}
	}
}