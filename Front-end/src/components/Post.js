// Post component - The post component is used in repetition on the home page. It displays the post's 
// image, the user who uploaded the image and allows a logged in user to react to the post. By clicking on
// the post, the user is redirected to the detailedPost component 
// Author(s) - Brendon
// Date - 18/10/19

import React from 'react';

import validateUserIdToken from './utils/validateToken'
import Reactions from './Reactions'

class Post extends React.Component {
    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - goToDetailed
    // Description - Redirects the user to the detailed post of the post that was clicked
    // Parameters - event (the data related to the user's actions when this function is called)
    // Return - N/A
    // Example of usage - this.goToDetailed
    goToDetailed = event => {
        event.preventDefault();
        this.props.history.push(`/view/${this.props.index}/1`)
    }

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - getUsername
    // Description - Hits the API to get the username of the userId provided
    // Parameters - N/A
    // Return - N/A
    // Example of usage - this.getUsername()
    getUsername(){
        fetch(`${process.env.REACT_APP_BACKEND_WEB_ADDRESS}/api/user/username/${this.props.post.userId}`)
        .then((response) => response.json())
        .then((responseJson) => {
            //Shortens the username if it is longer than 20 characters to it will fit in the post box
            if (responseJson.length > 20){
                responseJson = responseJson.substring(0,20) + '...'
            }
            this.setState({username: responseJson})
        })
    }

    //Set the post in state, get the username to be displayed and check if the user is logged in before rendering
    async componentWillMount() {
        //TODO: Currently takes a second or two until the user can react to a post
        this.setState({ post: this.props.post })
        this.getUsername()
        if (await validateUserIdToken()) {
            this.setState({
                reactCountsCanUseState: false,
                userIdToken: JSON.parse(localStorage.getItem("the_main_app")).userIdToken
            })
        } else {
            this.setState({ reactCountsCanUseState: false })
        }
    }

    render() {
        return (
            <div className="post">
                <div className="grid-element">
                    {/* Post image that, when clicked, redirects the user to the detailed post component */}
                    <div onClick={this.goToDetailed} className="grid-photo-wrapper">
                        <img className="grid-photo" src={this.props.post.imageLink} alt="Post"></img>
                    </div>
                    {/* Username of the post creator */}
                    <div className="grid-user-wrapper">
                        <div className="grid-user">{this.state.username}</div>
                    </div>
                    <br></br>
                    {/* Reaction buttons */}
                    <div className="home-reactions">
                        <Reactions state={this.state} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Post;