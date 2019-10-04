import React from "react";

import ReactS3 from "react-s3";
const config = {
  bucketName: 'brendon-aip-2019',
  region: 'ap-southeast-2',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
}

class AddPost extends React.Component {
  constructor() {
    super()
    this.state ={}
  }

  usernameRef = React.createRef();
  imageRef = React.createRef();

  createPost = event => {
    // 1.  stop the form from submitting
    event.preventDefault();

    if (this.state.imageLink !== "" && this.usernameRef.current.value !== ""){
      const post = {
        username: this.usernameRef.current.value,
        imageLink: this.state.imageLink,
        likes: 0
      };
      this.props.addPost(post);
    }
    else {
      console.log('Error!')
    }
    // refresh the form
    event.currentTarget.reset();
    this.setState({imageLink: ""})
  };

  upload = e => {
    ReactS3.uploadFile(e.target.files[0], config)
    .then((data) => {
      this.setState({imageLink: data.location})
    })
    .catch((error) => console.log(error))
  }

  render() {
    return (
      <div className="add-post">
        <form className="add-post-form" onSubmit={this.createPost}>
          <h2>Add Post</h2>
          <div className='input'>
            <input name="username" ref={this.usernameRef} type="text" placeholder="Username" required/>
            <input 
              type="file"
              onChange={this.upload}
              accept="image/*"
              required
            />
            <button type="submit">+ Add Post</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddPost;