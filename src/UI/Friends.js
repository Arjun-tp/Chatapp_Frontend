import React, {Component} from 'react';
import socket from '../utils/socket';
import auth from '../utils/auth';
import {Redirect} from 'react-router-dom';

export default class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends : [],
            // friendSearch: '',
            isLoggedIn: true
        };
        this.friends = [];
        this.friendsChangeListener = this.friendsChangeListener.bind(this);
        // this.searchFriend = this.searchFriend.bind(this);
        this.logout = this.logout.bind(this);
    }
    async componentWillMount() {
        socket.friendsChangeListener(this.friendsChangeListener);
        this.friendsChangeListener();
    }
    async friendsChangeListener() {
        const friends = await socket.emit('get-friends', {querry: {}, selfId: socket.userDetails.userId});
        if(!this.props.selectedFriend._id && (friends.length > 0))
        this.selectFriend(friends[0]);
        this.friends = friends;
        this.setState({friends});
    }
    async logout(e) {
        try {
            e.preventDefault();
            await auth.logout();
            this.setState({isLoggedIn: false});
        } catch(err) {
            console.log("error: ", err);
            alert("There was some problem while trying to logout");
        }
    }
    selectFriend(friend) {
        this.props.selectFriend(friend);
    }
    // searchFriend(e) {
    //     e.preventDefault();
    //     // this.setState({friendSearch: e.target.value});
    //     const pattern = e.target.value.toLowerCase();
    //     const friends = this.friends.filter((friend) => {
    //         return friend.name.toLowerCase().includes(pattern);
    //     });
    //     this.setState({friends});
    // }
    render() {
        if(this.state.isLoggedIn) {
            return (
                <div className="friends">
                    <section className="statusBar">
                        <p><b>
                            {
                                socket.userDetails.userName
                            }  
                        </b></p>
                        <a href="#" onClick={this.logout}>Logout</a>
                    </section>
                    {/* <section className="friends__searchbar">
                        <input type="text" value={this.state.friendSearch} onChange={this.searchFriend} placeholder="Search or start new chat" />
                    </section> */}
                    <section className="friends__list" style={{textAlign : 'center'}}>
                        {
                            this.state.friends.map((friend, n) => {
                                return (
                                    <a href="#" key={'friend_' + n} className={friend.isOnline ? 'online' : ''}
                                        onClick={this.selectFriend.bind(this, friend)}>
                                        <p>
                                            {
                                                friend.name
                                            }
                                        </p>
                                    </a>
                                );
                            })
                        }
                    </section>
                </div>
            );
        } else {
            return <Redirect to='/login' />;
        }
    }
}