import React from 'react';
import Post from './Post'

class PostDetailed extends React.Component {
    getPost() {
        fetch(`http://localhost:80/api/post/get/${this.props.match.params.postId}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ post : responseJson })
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