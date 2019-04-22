import React, {Component} from 'react';
import socket from '../utils/socket';
import "../styles/Chat.scss";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: ''
        };
        this.socket = null;
        this.newMessageListener = this.newMessageListener.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentWillMount() {
        this.socket = socket.getInstance();
        socket.listenForNewMessages(this.newMessageListener);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.selectedFriend._id != nextProps.selectedFriend._id) {
            this.setState({messages: [], message: ''});
            this.getChatHistory(nextProps.selectedFriend._id);
        }
    }
    async getChatHistory(friendId) {
        try {
            const chatHistory = await socket.emit('get-chat-history', {
                myId: socket.userDetails.userId,
                friendId
            });
            const sortedChat = chatHistory.sort((msg1, msg2) => {
                const time1 = new Date(msg1.sentAt).getTime();
                const time2 = new Date(msg2.sentAt).getTime();
                const diff = (time1 - time2);
                return diff;
            });
            this.setState({messages: sortedChat});
        } catch(err) {
            console.log("error: ", err);
            alert("There was some problem in fetching chat history");
        }
    }
    sendMessage(e) {
        e.preventDefault();
        const messageObj = {
            to: this.props.selectedFriend._id,
            msg: this.state.message,
            from: socket.userDetails.userId
        };
        socket.sendMessage(messageObj);
        this.newMessageListener(messageObj);
        this.setState({message: ""});
    }
    newMessageListener(msgObj) {
        const messages = [...this.state.messages];
        messages.push(msgObj);
        this.setState({messages});
    }
    render() {
        const chatArray = [...this.state.messages];
        return (
            <div className="chat__window">
                <section className="statusBar">
                    <p>
                        {
                            this.props.selectedFriend.name
                        }
                    </p>
                </section>
                <section className="chat__window--conversation">
                    <ul>
                        {
                            chatArray.reverse().map((message, n) => {
                                return (
                                    <li key={'message_' + n} className={(socket.userDetails.userId === message.from) ? "my-message" : "friend-message"}>
                                        {
                                            message.msg
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                </section>
                <form className="chatform" onSubmit={this.sendMessage}>
                    <input type="text" onChange={(e) => this.setState({message: e.target.value})} value={this.state.message} />
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    }
}