import React from 'react';
import Post from './Post';

import axios from 'axios';

class PostDetailed extends React.Component {
    getPost() {
        axios.get(`http://localhost:80/api/post/get/${this.props.match.params.postId}`)
            .then((response) => {
                this.setState({ post : response.data })
                console.log(response)
            })
            .catch((error) => {
            console.error(error);
            });
    }
    
    componentWillMount() {
        this.getPost();
    }

    state = {}

    render() {
        const id = this.props.match.params.postId;
        if (this.state.post){
            return (
                <div className="photo-grid">
                    <Post
                        key={id}
                        index={id}
                        details={this.state.post}
                        {...this.props}
                    />
                </div>
            )
        }
        else{
            return (
                <div>Post not found</div>
            )
        }
    }
}

export default PostDetailed;