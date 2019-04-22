import socketIoClient from 'socket.io-client';
import config from './config';

class Socket {
    constructor() {
        this.socketInstance = null;
        this.messageObservers = [];
        this.userDetails = {
            accessToken: '',
            userId: '',
            userName: ''
        };
        this.isConnected = false;
        this.setUserDetails = this.setUserDetails.bind(this);
        this.messageListener = this.messageListener.bind(this);
        this.friendsChangeListener = this.friendsChangeListener.bind(this);
        this.emit = this.emit.bind(this);
    }
    connect() {
        this.socketInstance = socketIoClient(config.baseUrl, {
            query: {
                token: this.userDetails.accessToken
            }
        });
        this.isConnected = true;
    }
    disconnect() {
        this.userDetails = {
            accessToken: '',
            userId: '',
            userName: ''
        };
        this.socketInstance.close();
    }
    async setUserDetails(userDetails) {
        this.userDetails = userDetails;
        if(!this.isConnected) {
            this.connect();
            this.messageListener();
        } else {
            console.log("Duplicate connection");
        }
        return null;
    }
    getInstance() {
        return this.socketInstance;
    }
    messageListener() {
        console.log("listening for new messages..");
        this.socketInstance.on("message", async (msg) => {
            this.messageObservers.forEach((fn) => fn(msg));
        });
    }
    friendsChangeListener(fn) {
        this.socketInstance.on('users-update', fn);
    }
    listenForNewMessages(fn) {
        if(!this.messageObservers.includes(fn)) {
            this.messageObservers.push(fn);
        }
    }
    unlistennewMessages(fn) {
        const listenerIndex = this.messageObservers.indexOf(fn);
        if(listenerIndex > -1) {
            this.messageObservers.splice(listenerIndex, 1);
        }
    }
    sendMessage(msg) {
        this.socketInstance.send(msg);
    }
    emit(eventName, data) {
        return new Promise((resolve, reject) => {
            this.socketInstance.emit(eventName, data, (res) => {
                if(!res.success) {
                    return reject(res.data);
                }
                return resolve(res.data);
            });
        });
    }
}
export default new Socket();