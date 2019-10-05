import React from "react";

import ReactS3 from "react-s3";
import validateUserIdToken from './utils/validateToken'

const config = {
  bucketName: 'brendon-aip-2019',
  region: 'ap-southeast-2',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
}

class AddPost extends React.Component {
  constructor() {
    super()

    this.state ={
      imageLink: ""
    }
  }

  usernameRef = React.createRef();

  createPost = event => {
    // 1.  stop the form from submitting
    event.preventDefault();

    ReactS3.uploadFile(this.state.file, config)
      .then((data) => {
        this.addPost(data)
      })
      .catch((error) => console.error(error))

      // refresh the form
      event.currentTarget.reset();
      this.setState({imageLink: ""})
  };

  async addPost(data){
    //Replace ALL ' ' with '+': https://stackoverflow.com/questions/3214886/javascript-replace-only-replaces-first-match
    var location = data.location.replace(/ /g,"+")
    this.setState({imageLink: location})

    if (this.state.imageLink !== "" && await validateUserIdToken()){
      const post = {
        userId: JSON.parse(localStorage.getItem("the_main_app")).userIdToken,
        imageLink: this.state.imageLink
      };
      this.props.addPost(post);
    }
    else {
      console.error('User not logged in ')
    }
  }

  upload = e => {
    //https://stackoverflow.com/questions/21720390/how-to-change-name-of-file-in-javascript-from-input-file
    //Creates unique filename for upload to s3
    var blob = e.target.files[0].slice(0, e.target.files[0].size, 'image/*'); 
    var newFile = new File([blob], `image${Date.now()}.${e.target.files[0].name.split(".")[1]}`, {type: 'image/*'});

    this.setState({file: newFile})
  }

  async componentWillMount() {
    this.setState({validUser: await validateUserIdToken()})
  }

  render() {
    //Renders the add post component if the user is logged in
    if (this.state.validUser){
      return (
        <div className="add-post">
          <form className="add-post-form" onSubmit={this.createPost}>
            {/* <h2>Add Post</h2> */}
            <div className='input'>
              <input 
                type="file"
                onChange={this.upload}
                accept="image/*"
                required
              />
              {/* {this.state.imageLink !== "" && */}
                <button type="submit">+ Add Post</button>
              {/* } */}
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div className="add-post">
          <h2>Please login to make a post</h2>
        </div>
      )
    }
  }
}

export default AddPost;