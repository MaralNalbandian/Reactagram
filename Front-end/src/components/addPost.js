// addPost component - The addPost component is used on the home screen and also used for replying to a 
// post. It allows a logged in user to upload an image of their choice (jpg, jpeg, png or gif) that will
// appear on the home page and/or as a reply.
// Author(s) - Brendon, Jarrod
// Date - 18/10/19

import React from "react";

import ReactS3 from "react-s3";
import validateUserIdToken from './utils/validateToken'

//Configuration for the S3 upload. The private information is kept in a .env file kept on local instances 
// and on the server but not pushed to GitHub
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
      imageLink: "",
      errorMessage: ""
    }
  }

  usernameRef = React.createRef();

  // Author(s) - Brendon
  // Date - 18/09/19
  // Function - createPost
  // Description - Uploads the file provided by the user to S3 and use the addPost function to add the 
  // post to the database
  // Parameters - event (this allows the form to be manipulated)
  // Return - N/A
  // Example of usage - this.createPost
  createPost = event => {
    //1. Remove the error message if there is one
    this.setState({errorMessage: ""})
    //2.  Stop the form from submitting
    event.preventDefault();
    //3. Upload the file to S3 using the config - utilises the npm package 'react-s3' from https://www.npmjs.com/package/react-s3
    ReactS3.uploadFile(this.state.file, config)
      .then((data) => {
        this.addPost(data)
      })
      .catch((error) => console.error(error))

    //4. Refresh the form and remove the imageLink from state so if an error occurs in the next post, a post isn't created with the previous imageLink
    event.currentTarget.reset();
    this.setState({imageLink: ""})
  };

  // Author(s) - Brendon
  // Date - 18/09/19
  // Function - addPost
  // Description - Updates the imageLink to match what is created in S3, validates that the post can be 
  // uploaded and then adds the post using the addPost function from the home component
  // Parameters - data (the response from the S3 file upload)
  // Return - N/A
  // Example of usage - addPost(data)
  async addPost(data){
    //Replace all ' ' with '+' - this is because the imageLink created by S3 replaces spaces with pluses
    //This code by user "Nick Craver" on Stack Overflow
    //https://stackoverflow.com/questions/3214886/javascript-replace-only-replaces-first-match
    var location = data.location.replace(/ /g,"+")
    this.setState({imageLink: location})

    //Don't upload if there is no imageLink or the user is not logged in anymore
    if (this.state.imageLink !== "" && await validateUserIdToken()){
      //Determines the type of file ie. jpeg, png, etc.
      var fileType = this.state.file.name.split(".")[1].toLowerCase() 

      //Only allows posts to be made if they are png, jpeg, jpg or gif
      if (fileType=== 'png' || fileType === 'jpeg' ||fileType === 'jpg' || fileType === 'gif'){
        const post = {
          userId: JSON.parse(localStorage.getItem("the_main_app")).userIdToken,
          imageLink: this.state.imageLink
        };
        this.props.addPost(post);
      } else {
        console.error('Filetype invalid. Please use JPEG, JPG, PNG or GIF files')
        this.setState({errorMessage: "Error"})
      }
    }
    else {
      console.error('Error occurred, please try again')
    }
  }

  // Author(s) - Brendon
  // Date - 18/09/19
  // Function - addPost
  // Description - Creates a unique filename and file object to store in state based on what the user 
  // uploads. This can then be used to upload to S3.
  // Parameters - event (the event when a user uploads an image)
  // Return - N/A
  // Example of usage - this.setFile
  setFile = event => {
    //Creates unique filename for upload to s3 by manipulating the existing file name
    //This code by 'Alexander Taborda' on Stack Overflow
    //https://stackoverflow.com/questions/21720390/how-to-change-name-of-file-in-javascript-from-input-file
    var blob = event.target.files[0].slice(0, event.target.files[0].size, 'image/*'); 
    var newFile = new File([blob], `image${Date.now()}.${event.target.files[0].name.split(".")[1]}`, {type: 'image/*'});

    this.setState({file: newFile})
  }

  async componentWillMount() {
    //Checks if the user is logged in before rendering
    this.setState({validUser: await validateUserIdToken()})
  }

  render() {
    //Renders the add post component if the user is logged in and has a valid token
    if (this.state.validUser){
      return (
        <div className="add-post">
          <form className="add-post-form" onSubmit={this.createPost}>
            <div className='input'>
              <input 
                type="file"
                onChange={this.setFile}
                accept="image/*"
                required
              />
              <button type="submit">+ Add Post</button>
              {/* Renders error message if problem occurs */}
              { this.state.errorMessage === "Error" &&
              <div className="Error">
                <p>The file you selected is invalid.</p>
                <p>Please use a .jpg, .png or .gif file</p>
              </div>
            }
            </div>
          </form>
        </div>
      );
    } else {
      return (
        // Gets the user to login if they want to make a post
        <div className="add-post">
          <h2>Please login to make a post</h2>
        </div>
      )
    }
  }
}

export default AddPost;