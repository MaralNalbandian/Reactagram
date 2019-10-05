import React from 'react';
import { Card, Button, Text } from 'react-bootstrap';

import Reactions from './Reactions'

class Post extends React.Component {
    constructor(){
        super();
        this.state = {
            reactCountsCanUseState: false,
            userIdtoken: JSON.parse(localStorage.getItem("the_main_app")).userIdtoken,
            token: JSON.parse(localStorage.getItem("the_main_app")).token
        }
    }

    goToDetailed = event => {
        event.preventDefault();
        this.props.history.push(`/view/${this.props.index}`)
    }

    like = event => {
        event.preventDefault();
        
    }

    componentWillMount() {
        this.setState({post: this.props.post})
    }

    render() {
        return (
            <div className="post">
                <div className="grid-element">
                    <div onClick={this.goToDetailed} className="grid-photo-wrapper">
                        <img className="grid-photo" src={this.props.post.imageLink} alt="Post"></img>
                    </div>
                    <div className="grid-user-wrapper">
                        <div className="grid-user">{this.props.post.userId}</div>
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