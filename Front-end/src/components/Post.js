import React from 'react';

class Post extends React.Component {
    goToDetailed = event => {
        event.preventDefault();
        this.props.history.push(`/view/${this.props.index}`)
    }

    like = event => {
        event.preventDefault();
        
    }

    render() {
        return (
            <div onClick={this.goToDetailed} className="post">
                <div className="grid-element">
                    <div className="grid-photo-wrapper">
                        <img className="grid-photo" src={this.props.details.imageLink} alt="Post"></img>
                    </div>
                    <div className="grid-user-wrapper">
                        <div className="grid-user">{this.props.details.userId}</div>
                    </div>
                    <button className="likeButton" >Like</button>
                </div>
            </div>
        )
    }
}

export default Post;