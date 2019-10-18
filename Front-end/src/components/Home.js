import React from "react";

import Post from "./Post";
import AddPost from "./addPost";
import Pages from "./Pages";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  addPost = post => {
    // 1. Add our new post using the API
    fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/post/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId: `post${Date.now()}`,
        userId: post.userId,
        imageLink: post.imageLink
      })
      // 2. Retrieve all the posts using the API
    }).then(() => {
      this.incrementUploads(post.userId);
      this.getPosts();
    });
  };

  incrementUploads(userId) {
    fetch(
      process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/user/incrementUpload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId
        })
      }
    );
  }

  getPosts() {
    fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/post/count")
      .then(response => response.json())
      .then(responseJson => {
        //TODO: Make more efficient
        var count = 1;
        var pages = [];
        while (count <= responseJson / 9 + 1) {
          pages.push(count);
          count = count + 1;
        }
        this.setState({
          pages: pages
        });
      })
      .catch(error => {
        console.error(error);
      });

    fetch(
      `${process.env.REACT_APP_BACKEND_WEB_ADDRESS}/api/post/page/${this.props.match.params.page}`
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          posts: responseJson
        });
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
      <React.Fragment>
        <div className="home">
          {/* Loads posts once they are fetched from the API */}
          {this.state.posts && this.state.pages && (
            <React.Fragment>
              <div className="photo-grid">
                {Object.keys(this.state.posts)
                  .slice(0, 9)
                  .map(key => (
                    <Post
                      key={key}
                      index={this.state.posts[key].postId}
                      post={this.state.posts[key]}
                      {...this.props}
                    />
                  ))}
              </div>
              <Pages
                pages={this.state.pages}
                currentPage={this.props.match.params.page}
                lastPage={this.state.pages[this.state.pages.length - 1]}
              />
            </React.Fragment>
          )}
          <h2>Add Post</h2>
          <AddPost addPost={this.addPost} />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
