import React from "react";

import Post from "./Post";
import AddPost from "./addPost";
import Nav from "./Nav";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  addPost = post => {
    // 1. Add our new post using the API
    fetch("http://localhost:80/api/post/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId: `post${Date.now()}`,
        username: post.username,
        imageLink: post.imageLink
      })
      // 2. Retrieve all the posts using the API
    }).then(() => this.getPosts());
  };

  getPosts() {
    fetch("http://localhost:80/api/post/all")
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ posts: responseJson });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillMount() {
    this.getPosts();
  }

  render() {
    return (
      <div className="home">
        <Nav />
        <h1>Home</h1>
        {/* Loads posts once they are fetched from the API */}
        {this.state.posts && (
          <div className="photo-grid">
            {Object.keys(this.state.posts).map(key => (
              <Post
                key={key}
                index={this.state.posts[key].postId}
                details={this.state.posts[key]}
                {...this.props}
              />
            ))}
          </div>
        )}
        <AddPost addPost={this.addPost} />
      </div>
    );
  }
}

export default Home;
