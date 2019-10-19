// Home component - The home component is the landing page of the application. It displays all the posts
// within the system, starting with the most popular (most reactions). The user will see 9 posts per page.
// The home component also includes the AddPost component that allows the user to add a post to the system.
// Author(s) - Brendon
// Date - 18/10/19

import React from "react";

import Post from './Post';
import AddPost from './addPost';
import Pages from './Pages';

class Home extends React.Component {
    state = {}

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - addPost
    // Description - Adds a post to the system by hitting the API endpoint with post data. The 
    // incrememntUpload function is then called and the  all posts are retrieved and displayed
    // Parameters - post (Object with userId and imageLink) eg. {userId: '5d9ba870723259218c17b5f1', imageLink: 'https://brendon-aip-2019.s3.amazonaws.com/image1570483251483.gif'}
    // Return - N/A
    // Example of usage - addPost(post)
    addPost = post => {
        //1. Add our new post using the API
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "postId": `post${Date.now()}`,
                "userId": post.userId,
                "imageLink": post.imageLink
            })
        }).then( () => {
            // 2. Increment the upload count for the user who made the upload
            this.incrementUploads(post.userId);
            // 3. Retrieve all the posts using the API
            this.getPosts();
        }).catch( error => console.error(error))
    };

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - incrementUploads()
    // Description - Increment the upload count for the user who made the upload. This allows us to 
    // determine which users have the most uploads and should be on the leaderboard.
    // Parameters - userId
    // Return - N/A
    // Example of usage - incrementUploads(post.userId)
    incrementUploads(userId) {
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/user/incrementUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": userId
            })
        }).catch( error => console.error(error))
    }

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - getPosts()
    // Description - Determine how many pages of posts there are and then get the posts for the 
    // current page the user is on
    // Parameters - N/A
    // Return - N/A
    // Example of usage - getPosts()
    getPosts() {
        //Get the number of posts in the system to determine how many pages there are
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/post/count")
            .then((response) => response.json())
            .then((responseJson) => {
                //Creates an array of page numbers to be used by the "pages" component
                var count = 1;
                var pages = [];
                while (count <= (responseJson / 9) + 1) {
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

        //Get all the posts on the current page
        fetch(`${process.env.REACT_APP_BACKEND_WEB_ADDRESS}/api/post/page/${this.props.match.params.page}`)
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
        //Gets the posts before the site is rendered
        this.getPosts();
    }

    render() {
        return (
            <div className="home">
                {/* Loads posts once they are fetched from the API */}
                {this.state.posts && this.state.pages &&
                    <React.Fragment>
                        <div className="photo-grid">
                            {Object.keys(this.state.posts).map(key => (
                                <Post
                                    key={key}
                                    index={this.state.posts[key].postId}
                                    post={this.state.posts[key]}
                                    {...this.props}
                                />
                            ))}
                        </div>
                        {/* Pagination */}
                        <Pages
                            pages={this.state.pages}
                            currentPage={this.props.match.params.page}
                            lastPage={this.state.pages[this.state.pages.length - 1]}
                        />
                    </React.Fragment>
                }
                {/* Adding a post */}
                <h2>Add Post</h2>
                <AddPost addPost={this.addPost} />
            </div>
        )
    }
}

export default Home;