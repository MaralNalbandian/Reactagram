import React from "react";

import Post from "./Post";
import AddPost from "./addPost";
import Menu from "./Menu";

import axios from "axios";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  addPost = post => {
    // 1. Add our new post using the API
    axios("http://localhost:80/api/post/add", {
      method: "post",
      data: {
        postId: `post${Date.now()}`,
        username: post.username,
        imageLink: post.imageLink
      }
      // 2. Retrieve all the posts using the API
    }).then(() => this.getPosts());
  };

  getPosts() {
    axios
      .get("http://localhost:80/api/post/all")
      .then(response => this.setState({ posts: response.data }))
      .catch(error => {
        console.error(error);
      });
  }

  componentWillMount() {
    this.getPosts();
  }

  render() {
    return (
      <React.Fragment>
        {/* <Menu/> */}
        <div className="home">
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
      </React.Fragment>
    );
  }
}

export default Home;
