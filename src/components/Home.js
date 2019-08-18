import React from 'react';

import Post from './Post';
import samplePosts from '../sample-posts'
import AddPost from './addPost';

class Home extends React.Component {  
    state = {
        posts: samplePosts
    }

    addPost = post => {
        // 1. Take a copy of the existing state
        const posts = { ...this.state.posts };
        // 2. Add our new fish to that fishes variable
        posts[`post${Date.now()}`] = post;
        // 3. Set the new fishes object to state
        this.setState({ posts });
    };

    render() {
        console.log(this.state.posts)
        return (
            <div className="home">
                <h1>Home</h1>
                <div className="photo-grid">
                    {Object.keys(this.state.posts).map(key => (
                        <Post
                            key={key}
                            index={key}
                            details={this.state.posts[key]}
                            {...this.props}
                        />
                    ))}
                </div>
                <AddPost addPost={this.addPost}/>
            </div>
        )
    }
}

export default Home;