import Cookies from 'universal-cookie';
import socket from './socket';
import config from './config';
const cookies = new Cookies();

class Auth {
	constructor() {
		this.login = this.login.bind(this);
		this.register = this.register.bind(this);
		this.setUserDetailsToCookies = this.setUserDetailsToCookies.bind(this);
		this.baseUrl = config.baseUrl;
	}
	async logout() {
		try {
			await cookies.remove('accessToken', {path: '/'});
			await cookies.remove('userId', {path: '/'});
			await cookies.remove('userName', {path: '/'});
			socket.disconnect();
			return true;
		} catch(err) {
			console.log("err: ", err);
			throw new Error("Unable to logout");
		}
	}
	async callApi(apiName, data) {
		try {
			const url = `${this.baseUrl}/api/v1/auth/${apiName}`;
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			});
			const jsonResponse = await response.json();
			if(!jsonResponse.success)
				throw new Error(jsonResponse.data);
			return jsonResponse.data;
		} catch(err) {
			throw err;
		}
	}
	async login(credentials) {
		try {
			const loginResponse = await this.callApi('login', credentials);
			await this.setUserDetailsToCookies(loginResponse);
			return loginResponse.token;
		} catch(err) {
			console.log("error in logging in: ", err);
			throw new Error("There was some issue while trying to login");
		}
	}
	async register(data) {
		try {
			const registerResponse = await this.callApi('register', data);
			await this.setUserDetailsToCookies(registerResponse);
			return registerResponse.accessToken;
		} catch(err) {
			console.log("Error occured while registering: ", err);
			throw err;
		}
	}
	async setUserDetailsToCookies(userDetails) {
		await cookies.set('accessToken', userDetails.accessToken, {path: '/'});
		await cookies.set('userId', userDetails.userId, {path: '/'});
		await cookies.set('userName', userDetails.userName, {path: '/'});
		socket.setUserDetails(userDetails);
	}
	authenticate() {
		const accessToken = cookies.get('accessToken');
		const userId = cookies.get('userId');
		const userName = cookies.get('userName');
		if(accessToken) {
			socket.setUserDetails({accessToken,userId,userName});
			return true;
		}
		return false;
	}
}


export default new Auth();