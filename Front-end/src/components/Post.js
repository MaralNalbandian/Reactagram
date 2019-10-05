import React from 'react';
import validateUserIdToken from './utils/validateToken'

import Reactions from './Reactions'

class Post extends React.Component {
    goToDetailed = event => {
        event.preventDefault();
        this.props.history.push(`/view/${this.props.index}`)
    }

    getUsername(){
        fetch(`http://localhost:80/api/user/username/${this.props.post.userId}`)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({username: responseJson})
        })
    }

    async componentWillMount() {
        this.setState({post: this.props.post})
        this.getUsername()
        if (await validateUserIdToken()){
            this.state = {
                reactCountsCanUseState: false,
                userIdToken: JSON.parse(localStorage.getItem("the_main_app")).userIdToken
            }
        } else {
            this.state = {
                reactCountsCanUseState: false
            }
        }
    }

    render() {
        return (
            <div className="post">
                <div className="grid-element">
                    <div onClick={this.goToDetailed} className="grid-photo-wrapper">
                        <img className="grid-photo" src={this.props.post.imageLink} alt="Post"></img>
                    </div>
                    <div className="grid-user-wrapper">
                        <div className="grid-user">{this.state.username}</div>
                    </div>
                    <div className="home-reactions">
                        <Reactions state={this.state}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Post;