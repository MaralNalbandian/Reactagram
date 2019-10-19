// PostDetailed Component
// Description: The page that users are viewing when they wish to view the replies and post in more detail.
// Author(s) - Jarrod
// Date - 18/10/19
import React from 'react';
import AddPost from './addPost';
import { Card, Button, Row, Col, Container, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';
import validateUserIdToken from './utils/validateToken'
import Reactions from './Reactions';
import Pages from './Pages';

import axios from 'axios';

class PostDetailed extends React.Component {
    //Setting the initial reaction counts; when they are loaded they're loaded directly from the server into state
    //any changes are manipulated inside state first, then state is posted to endpoint.
    constructor(props) {
        super(props)
        this.state = {
            reactionCounts: {
                like: 0,
                love: 0,
                laugh: 0,
                sad: 0,
                angry: 0,
            },
            replyObjects: [],
            pages: [],
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDeleteWithPlaceholder = this.handleDeleteWithPlaceholder.bind(this);
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - getPost
    // Description - Get the specific post based on id from the API and save the post to state
    // Parameters - N/A
    // Return - N/A
    // Example of usage - this.getPost()
    getPost() {
        return axios.get(`${process.env.REACT_APP_BACKEND_WEB_ADDRESS}/api/post/get/${this.props.match.params.postId}`)
            .then((response) => {
                this.setState({ post: response.data })
            }).then(() => this.paginate())
            .catch((error) => {
                console.error(error)
            });
    }

    //Get the data for the detailed post then set the user token in storage if it exists before the component renders
    async componentWillMount() {
        this.getPost()
            .then(() => this.getReplyObjects());

        //If user is logged in :
        if (await validateUserIdToken()) {
            this.setState({ token: JSON.parse(localStorage.getItem("the_main_app")).token })
            this.setState({ userIdToken: JSON.parse(localStorage.getItem("the_main_app")).userIdToken })
        }

        else {
            this.setState({ token: undefined })
            this.setState({ userIdToken: undefined })

        }

        this.setState({ reactCountsCanUseState: false })
    }

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - paginate
    // Description - Determine the number of pages required based on the number of replies. THis limits 
    // the amount of replies to reduce bandwidth usage and paginate rest of results.
    // Parameters - N/A
    // Return - N/A
    // Example of usage - this.paginate()
    paginate() {
        var response = this.state.post;
        var count = 1;
        var pages = [];
        while (count <= (response.replies.length / 3) + 1) {
            pages.push(count)
            count = count + 1
        }
        this.setState({
            pages: pages
        })
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - addPost
    // Description - Add the reply to the posts collection, then also add the posts' id to this post's reply array.
    // Parameters - post: this post object in state
    // Return - N/A
    // Example of usage - this.addPost()
    addPost = post => {
        var dateNow = Date.now();
        // 1. Add our new post using the API
        try {
            axios(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/post/add", {
                method: "post",
                data: {
                    postId: `post${dateNow}`,
                    userId: post.userId,
                    imageLink: post.imageLink
                }
            });
        }
        catch (error) {
        }

        // 2. Increment the number of uploads the user has completed
        this.incrementUploads(post.userId);
        // 3. Update the replies on screen
        this.updateReplies(dateNow);
    };

    // Author(s) - Brendon
    // Date - 18/09/19
    // Function - incrementUploads
    // Description - Increment the uploads variable by 1 for this user - used for leaderboard functionality.
    // Parameters - userId: gathered from localStorage - unique user id to increment uploads variable of
    // Return - N/A
    // Example of usage - this.incrementUploads(this.state.userIdToken)
    incrementUploads(userId) {
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/user/incrementUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": userId
            })
        })
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - updateReplies
    // Description - Create a new post object for this reply, also add it to the replies array of this object.
    // Parameters - dateId: the Date.Now so that it can stay consistent for both the replies array and the new post object.
    // Return - N/A
    // Example of usage - this.updateReplies(this.state.Date.Now())
    updateReplies(dateId) {

        //push postId to replies array

        this.state.post.replies.push(`post${dateId}`);

        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => {
                this.setState((this.state), () => this.getReplyObjects());

            })
            .catch((error) => console.error(error))

    };

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - handleEdit
    // Description - If this option is available (no reactions / replies yet), user can uploaid a new image to change it.
    // Parameters - post: this post object in state
    // Return - N/A
    // Example of usage - this.handleEdit()
    handleEdit = post => {
        //1. UPDATE this.state.post.imageLink with the link
        this.state.post.imageLink = post.imageLink;

        //2. replicate the fetch Post  to /post/react with this.state.post as the body
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => this.setReactionCountStates())
            .catch((error) => console.error(error))
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - handleDelete
    // Description - If this option is available, user can press delete to HARD delete it from the database
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.handleDelete()
    handleDelete() {
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => window.alert("Post Succesfully Deleted"))
            .catch((error) => console.error(error))

        this.setState(this.state); //refresh state 

    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - handleDeleteWithPlaceholder
    // Description - If this option is available, user can press delete to change the image url to a preset placeholder image.
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.handleDeleteWithPlaceholder()
    handleDeleteWithPlaceholder() {
        //1. UPDATE this.state.post.imageLink with the link
        this.state.post.imageLink = "https://brendon-aip-2019.s3-ap-southeast-2.amazonaws.com/deleted.jpg";

        //2. replicate the fetch Post  to /post/react with this.state.post as the body
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => this.setReactionCountStates())
            .catch((error) => console.error(error))

    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - renderButtons
    // Description - Handles which buttons are shown to the user who made this post - e.g. delete, edit, placeholder.
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.renderButtons()
    renderButtons() {
        //if logged in..
        if (this.state.userIdToken != undefined) {

            //if this is this user's post
            if (this.state.userIdToken == this.state.post.userId) {

                //1. Check if post has no reacts and no replies
                if (this.state.post.replies.length == 0 && this.state.post.reacts.length == 0) {
                    //has no reacts and no replies: return both buttons
                    return (
                        <div>
                            <div >
                                <h2>Change Post</h2>
                                <Button variant="primary" className="pull-right" onClick={() => this.handleDelete()}>DELETE POST</Button>
                                <AddPost addPost={this.handleEdit} />

                            </div>

                        </div>
                    )
                }


                //2. Check if this post has reaction
                if (this.state.post.reacts.length != 0) {
                    //post has reaction, can be deleted but not changed
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                            <ButtonToolbar>
                                <Button variant="primary" className="pull-right" onClick={() => this.handleDelete()}> DELETE POST</Button>
                            </ButtonToolbar>
                        </div>
                    )
                }


                //3. Check if this post has reply
                if (this.state.post.replies.length != 0) {

                    //check if the image is ALREADY a placeholder
                    if (this.state.post.imageLink != "https://brendon-aip-2019.s3-ap-southeast-2.amazonaws.com/deleted.jpg") {
                        //has a reply: can be replaced by a holder saying it has been "deleted"
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                                <ButtonToolbar>
                                    {/* <Button variant="primary" className="pull-right">EDIT POST</Button> */}
                                    <Button variant="primary" className="pull-right" onClick={() => this.handleDeleteWithPlaceholder()}>DELETE POST (with Placeholder)</Button>
                                </ButtonToolbar>
                            </div>
                        )
                    }
                }

            }

            else {
                //render nothing if not this user's post
                return (<div></div>)
            }

        }

        else {
            //render nothing if user not logged in
            return (<div></div>)
        }

    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - getReplyObjects
    // Description - Transform the postId's in the replies array into an array of objects to grab their information.
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.getReplyObjects()
    getReplyObjects() {

        //make a fetch call for each postId in this.post.replies
        //set state now

        //check if this.state.post.replies exists
        if (this.state.post !== undefined) {

            //reset this.state.replyObjects
            this.setState({ replyObjects: [] })

            //loop a fetch request
            for (var i = 0; i < this.state.post.replies.length; i++) {
                axios.get(`${process.env.REACT_APP_BACKEND_WEB_ADDRESS}/api/post/get/${this.state.post.replies[i]}`)
                    .then((response) => {
                        //this.setState({ post: response.data })
                        this.state.replyObjects.push(response.data)
                        this.state.replyObjects.sort(function (a, b) {
                            var nameA = a.postId.toUpperCase(); // ignore upper and lowercase
                            var nameB = b.postId.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        });
                        this.setState(this.state) //refresh state
                        this.getPost();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }


    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - sortByPopular
    // Description - Sort an array with simple algorithm based on that posts' reactions.
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.sortByPopular()
    sortByPopular() {
        //TODO: check if any replies otherwise  do nothing
        this.state.replyObjects.sort((b, a) => parseFloat(a.reacts.length) - parseFloat(b.reacts.length));
        this.setState(this.state)
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - sortByNew
    // Description - Sort an array with simple algorithm based on that posts' date.
    // Parameters - NA (just uses state)
    // Return - N/A
    // Example of usage - this.sortByNew()
    sortByNew() {
        //TODO: check if any replies otherwise  do nothing
        this.state.replyObjects.sort((b, a) => Date.parse(a.date) - Date.parse(b.date));
        this.setState(this.state)
    }

    render() {
        //get total amounts of reactions
        //this.getReactionCounts();
        const id = this.props.match.params.postId;

        //get replies into an array of objects in state called "replyObjects"

        if (this.state.post) {
            if (this.props.match.params.page == 1) {
                var startNum = 0;
                var endNum = 3
            } else {
                var startNum = ((Number(this.props.match.params.page) - 1) * 3);
                var endNum = startNum + 3;
            }
            // { this.getReactionCounts("like") }
            return (


                <Container>
                    {this.renderButtons()}
                    {/* {this.getReplyObjects()} */}

                    <div className="photo-grid" >

                        {/* // Begin Post Section */}
                        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <div>

                            </div>
                            <Row>
                                <Col xs={8}>
                                    <Card style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400,

                                    }}
                                        key={id}>
                                        {/* <Card.Title>Post by {this.state.post.userId}</Card.Title> */}
                                        {/* <Card.Subtitle className="mb-2 text-muted">At {this.state.post.date}</Card.Subtitle> */}
                                        <Card.Img variant="bottom" src={this.state.post.imageLink} />

                                        <Card.Body>
                                            <Reactions state={this.state} />
                                        </Card.Body>

                                        <Card.Body>
                                            {/* Reply Form Goes Here */}
                                            <h2>Add Reply</h2>
                                            <AddPost addPost={this.addPost} />
                                        </Card.Body>
                                    </Card>

                                </Col>
                            </Row>

                        </Container>

                        {/* begin replies */}
                        <Container className="pull-right" style={{ justifyContent: 'center', alignItems: 'right', padding: 16 }}>
                            <hr></hr>
                            <h2>Replies</h2>
                            <div>
                                <Row className="pull-right" style={{ justifyContent: 'center', alignItems: 'center', padding: 8, }}>

                                    <Col xs={8}>
                                        <DropdownButton id="dropdown-basic-button" title="Sort By">
                                            <Dropdown.Item onSelect={() => this.sortByNew()}>New</Dropdown.Item>
                                            <Dropdown.Item onSelect={() => this.sortByPopular()}>Popular</Dropdown.Item>
                                        </DropdownButton>
                                    </Col>

                                </Row>
                            </div>

                        </Container>

                        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>

                            <Row id="replies" style={{ justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                                <Col xs={8} >

                                    {this.state.replyObjects.slice(startNum, endNum).map(
                                        reply =>
                                            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}
                                                key={reply.postId}>

                                                <Card style={{
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center', width: 500,
                                                }} >
                                                    <Card.Img variant="top" src={reply.imageLink}
                                                        href="jeff" />
                                                    <Card.Body>
                                                        {/* <Card.Title>Reply by {reply.userId}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">At {reply.date}</Card.Subtitle> */}
                                                        {/* have to go to the actual post to reply to it. Reply is not directly avaialble from the comments. */}
                                                        <Card.Link href={"/view/" + reply.postId + '/1'}>View this Post</Card.Link>
                                                    </Card.Body>
                                                </Card>
                                            </Row>
                                    )}

                                </Col>
                            </Row>

                        </Container>
                        <Pages
                            pages={this.state.pages}
                            currentPage={this.props.match.params.page}
                            lastPage={this.state.pages[this.state.pages.length - 1]}
                            postId={this.props.match.params.postId}
                        />
                    </div>
                </Container>
            )
        }
        else {
            return (
                <div>Post not found</div>
            )
        }
    }
}

export default PostDetailed;