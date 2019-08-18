import React from "react";

class AddPost extends React.Component {
  usernameRef = React.createRef();
  imageRef = React.createRef();

  createPost = event => {
    // 1.  stop the form from submitting
    event.preventDefault();
    const post = {
      username: this.usernameRef.current.value,
      image: this.imageRef.current.value
    };
    this.props.addPost(post);
    // refresh the form
    event.currentTarget.reset();
  };
  render() {
    return (
      <form className="post-edit" onSubmit={this.createPost}>
        <input name="username" ref={this.usernameRef} type="text" placeholder="Username" />
        <input
          name="image"
          ref={this.imageRef}
          type="text"
          placeholder="Image"
        />
        <button type="submit">+ Add Post</button>
      </form>
    );
  }
}

export default AddPost;