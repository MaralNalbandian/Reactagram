import React from 'react';
import Posts from '../sample-posts'
import Post from './Post'

class PostDetailed extends React.Component {
    render() {
        const id = this.props.match.params.postId;
        if (Posts[id]){
            return (
                <div className="photo-grid">
                    <Post
                        key={id}
                        index={id}
                        details={Posts[id]}
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