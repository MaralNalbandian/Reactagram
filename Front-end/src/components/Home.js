import React from 'react';

import Post from './Post';
import AddPost from './addPost';
import Pages from './Pages';

class Home extends React.Component {  
    constructor() {
        super()
        this.state ={
        }
    }

    addPost = post => {
        // 1. Add our new post using the API
        fetch('http://localhost:80/api/post/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "postId": `post${Date.now()}`,
                "username": post.username,
                "imageLink": post.imageLink
            })
        // 2. Retrieve all the posts using the API
        }).then( () => this.getPosts())
    };

    getPosts() {
        fetch("http://localhost:80/api/post/count")
        .then((response) => response.json())
        .then((responseJson) => {
            //TODO: Make more efficient
            var count = 1;
            var pages = [];
            while (count <= (responseJson/9)+1){
                pages.push(count)
                count = count + 1
            }
            this.setState({ 
                pages: pages
            })
        })
        .catch((error) => {
        console.error(error);
        });

        fetch(`http://localhost:80/api/post/page/${this.props.match.params.page}`)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ 
                posts: responseJson, 
            })
        })
        .catch((error) => {
        console.error(error);
        });
    }

    componentWillMount() {
        this.getPosts()
    }

    render() {
        return (
            <React.Fragment>
                <div className="home">
                    {/* Loads posts once they are fetched from the API */}
                    {this.state.posts && this.state.pages &&
                        <React.Fragment>
                            <div className="photo-grid">
                                {Object.keys(this.state.posts).slice(0,9).map(key => (
                                    <Post
                                        key={key}
                                        index={this.state.posts[key].postId}
                                        details={this.state.posts[key]}
                                        {...this.props}
                                    />
                                ))}
                            </div>
                            <Pages 
                                pages= {this.state.pages}
                                currentPage= {this.props.match.params.page}
                                lastPage= {this.state.pages[this.state.pages.length-1]}
                            />
                        </React.Fragment>
                    }

                    <AddPost addPost={this.addPost}/>
                </div>
            </React.Fragment>
        )
    }
}

export default Home;