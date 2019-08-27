import React from "react";

class AddPost extends React.Component {
  usernameRef = React.createRef();
  imageRef = React.createRef();

  createPost = event => {
    // 1.  stop the form from submitting
    event.preventDefault();
    const post = {
      username: this.usernameRef.current.value,
      imageLink: this.imageRef.current.value
    };
    this.props.addPost(post);
    // refresh the form
    event.currentTarget.reset();
  };
  render() {
    return (
      <div className="add-post">
        <form className="add-post-form" onSubmit={this.createPost}>
          <h2>Add Post</h2>
          <div className='input'>
            <input name="username" ref={this.usernameRef} type="text" placeholder="Username" />
            <input
              name="image"
              ref={this.imageRef}
              type="text"
              placeholder="Image"
            />
            <button type="submit">+ Add Post</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddPost;