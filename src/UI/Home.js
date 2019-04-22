import React, {Component} from 'react';
import Chat from './Chat';
import Friends from './Friends';

export default class ChatRooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFriend: {}
        }
        this.chatRef = React.createRef();
        this.selectFriend = this.selectFriend.bind(this);
    }
    componentWillMount() {}
    selectFriend(friend) {
        this.setState({selectedFriend: {...friend}}, () => {
            this.forceUpdate();
        });
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
                <div style={{flex: 1, height: '100%'}}>
                    <Friends selectedFriend={this.state.selectedFriend} selectFriend={this.selectFriend}></Friends>
                </div>
                <div style={{flex: 3, height: '100%'}}>
                    <Chat selectedFriend={this.state.selectedFriend}></Chat>
                </div>
            </div>
        );
    }
}