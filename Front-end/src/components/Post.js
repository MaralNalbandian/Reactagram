import React from 'react';
import { Card, Button, Text } from 'react-bootstrap';

class Post extends React.Component {
    goToDetailed = event => {
        event.preventDefault();
        this.props.history.push(`/view/${this.props.index}`)
    }

    render() {
        console.log("props:", this.props)
        console.log(this.props.details)
        return (
            <div onClick={this.goToDetailed} className="post">
                <div className="grid-element">
                    <div className="grid-photo-wrapper">
                        <img className="grid-photo" src={this.props.details.imageLink} alt="Post"></img>
                    </div>
                    <div className="grid-user-wrapper">
                        <div className="grid-user">{this.props.details.username}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Post;