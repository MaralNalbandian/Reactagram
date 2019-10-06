import React from 'react';
import AddPost from './addPost';
import { Card, Button, Row, Col, ListGroup, Container, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';
import validateUserIdToken from './utils/validateToken'

import axios from 'axios';

class PostDetailed extends React.Component {
    getPost() {
        return axios.get(`http://localhost:80/api/post/get/${this.props.match.params.postId}`)
            .then((response) => {
                this.setState({ post: response.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }

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
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDeleteWithPlaceholder = this.handleDeleteWithPlaceholder.bind(this);
    }

    async componentWillMount() {
        this.getPost()
            .then(() => this.getReplyObjects());

        //if user is logged in :

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

    getReactionCounts(type) {
        var sum = 0;
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == type) {

                sum = sum + 1;
            }
        }
        return sum;

    }

    setReactionCountStates() {
        var sum = 0;

        //check like
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == "like") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.like = sum;
        this.setState(this.state)


        //check love
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == "love") {

                sum = sum + 1;
            }
        }

        this.state.reactionCounts.love = sum;
        this.setState(this.state)


        //check laugh
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == "laugh") {

                sum = sum + 1;
            }
        }

        this.state.reactionCounts.laugh = sum;
        this.setState(this.state)


        //check sad
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == "sad") {

                sum = sum + 1;
            }
        }

        this.state.reactionCounts.sad = sum;
        this.setState(this.state)


        //check angry
        for (var i = 0; i < this.state.post.reacts.length; i++) {

            if (this.state.post.reacts[i].reaction == "angry") {

                sum = sum + 1;
            }
        }

        this.state.reactionCounts.angry = sum;
        this.setState(this.state);


    }

    handleReact(reactType) {

        this.setState({
            reaction: reactType
        },

            function updateReacts() {
                let operationComplete = false;

                //if logged in..
                if (this.state.userIdToken != undefined) {
                    //if user is logged in

                    //check if user has reacted to this post already.
                    for (var i = 0; i < this.state.post.reacts.length; i++) {
                        if (this.state.post.reacts[i].userId == this.state.userIdToken) {

                            //now check if the user's reaction is the same
                            //in this case REMOVE their reaction

                            if (this.state.reaction == this.state.post.reacts[i].reaction) {


                                //REMOVE this object from the array



                                var newArray = this.state.post.reacts.filter(object => object.userId != this.state.userIdToken);
                                //need to post this to db after


                                this.state.post.reacts = newArray;
                                this.state.post.numOfReacts = this.state.post.numOfReacts - 1;
                                operationComplete = true;
                            }
                            else {
                                //if their reaction is different
                                this.state.post.reacts[i].reaction = this.state.reaction;
                                operationComplete = true;
                            }

                        }
                    }
                    //now we've finished looping, if an operation has not been performed
                    //this means they don't have a reaction already, so..
                    if (operationComplete != true) {
                        //user is making a new reaction
                        var tempReact = {
                            userId: this.state.userIdToken,
                            reaction: this.state.reaction
                        }

                        //push it into the post object in state
                        this.state.post.reacts.push(tempReact)
                        this.state.post.numOfReacts = this.state.post.numOfReacts + 1;

                    }

                    //this runs no matter what since we're just manipulating state except if not logged in
                    //POST state to database
                    fetch('http://localhost:80/api/post/react', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.state.post)
                    })
                        .then(() => this.setReactionCountStates())
                        .catch((error) => console.error(error))
                }

                else {

                    //if user is not logged in yet pop up a  toast
                    window.alert("You need to be logged in to react to posts!");

                }

            }

        )
    }

    addPost = post => {
        var dateNow = Date.now();
        // 1. Add our new post using the API
        try {
            axios("http://localhost:80/api/post/add", {
                method: "post",
                data: {
                    postId: `post${dateNow}`,
                    userId: post.userId,
                    imageLink: post.imageLink
                }
                //2. Also Update the replies of this post
            });
        }
        catch (error) {

        }
        // .then(
        // () => 
        this.incrementUploads(post.userId);
        this.updateReplies(dateNow);
        // .then(
        // 3. Retrieve all the posts using the API
        // () => this.getPosts()
        // )
        // );
    };

    incrementUploads(userId) {
        fetch('http://localhost:80/api/user/incrementUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": userId
            })
        })
    }

    updateReplies(dateId) {

        //push postId to replies array

        this.state.post.replies.push(`post${dateId}`);

        fetch('http://localhost:80/api/post/react', {
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


    handleEdit = post => {
        //1. UPDATE this.state.post.imageLink with the link
        this.state.post.imageLink = post.imageLink;

        //2. replicate the fetch Post  to /post/react with this.state.post as the body
        fetch('http://localhost:80/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => this.setReactionCountStates())
            .catch((error) => console.error(error))
    }

    handleDelete() {


        fetch('http://localhost:80/api/post/delete', {
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

    handleDeleteWithPlaceholder() {
        //1. Just update react endpoitn to change the image link too

        //2. on submit in addPost this gets called..


        //3. UPDATE this.state.post.imageLink with the link
        this.state.post.imageLink = "https://brendon-aip-2019.s3-ap-southeast-2.amazonaws.com/deleted.jpg";

        //4. replicate the fetch Post  to /post/react with this.state.post as the body
        fetch('http://localhost:80/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => this.setReactionCountStates())
            .catch((error) => console.error(error))

    }

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

    getReplyObjects() {


        //make a fetch call for each postId in this.post.replies
        //debugger;
        //set state now

        //check if this.state.post.replies exists
        if (this.state.post !== undefined) {

            //reset this.state.replyObjects
            this.setState({ replyObjects: [] })

            //loop a fetch request
            for (var i = 0; i < this.state.post.replies.length; i++) {
                //var getLink = 'http://localhost:80/api/post/get/$' + this.state.post.replies
                axios.get(`http://localhost:80/api/post/get/${this.state.post.replies[i]}`)
                    .then((response) => {
                        //this.setState({ post: response.data })
                        this.state.replyObjects.push(response.data)
                        this.setState(this.state) //refresh state
                        this.getPost();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }


    }

    getUsername() {
        console.log(this.state)
    }

    sortByPopular() {
        //TODO: check if any replies otherwise  do nothing
        this.state.replyObjects.sort((b, a) => parseFloat(a.reacts.length) - parseFloat(b.reacts.length));
        this.setState(this.state)
    }

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
            // { this.getReactionCounts("like") }
            {this.getUsername()}
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
                                            <Row>
                                                <Col>
                                                    <Button style={{ fontSize: 20 }} variant="light" onClick={() => this.handleReact("like")}>👍</Button>
                                                    <h5 className="pull-right">
                                                        {this.state.reactCountsCanUseState ? this.state.reactionCounts.like : this.getReactionCounts("like")}
                                                    </h5>
                                                </Col>

                                                <Col>
                                                    <Button style={{ fontSize: 20 }} variant="light" onClick={() => this.handleReact("love")}>😍</Button>
                                                    <h5 className="pull-right">
                                                        {this.state.reactCountsCanUseState ? this.state.reactionCounts.love : this.getReactionCounts("love")}
                                                    </h5>
                                                </Col>

                                                <Col>
                                                    <Button style={{ fontSize: 20 }} variant="light" onClick={() => this.handleReact("laugh")}>😂</Button>
                                                    <h5 className="pull-right">
                                                        {this.state.reactCountsCanUseState ? this.state.reactionCounts.laugh : this.getReactionCounts("laugh")}
                                                    </h5>
                                                </Col>

                                                <Col>
                                                    <Button style={{ fontSize: 20 }} variant="light" onClick={() => this.handleReact("sad")}>😢</Button>
                                                    <h5 className="pull-right">
                                                        {this.state.reactCountsCanUseState ? this.state.reactionCounts.sad : this.getReactionCounts("sad")}
                                                    </h5>
                                                </Col>

                                                <Col>
                                                    <Button style={{ fontSize: 20 }} variant="light" onClick={() => this.handleReact("angry")}>😡</Button>
                                                    <h5 className="pull-right">
                                                        {this.state.reactCountsCanUseState ? this.state.reactionCounts.angry : this.getReactionCounts("angry")}
                                                    </h5>
                                                </Col>

                                            </Row>
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

                                    {this.state.replyObjects.map(
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
                                                        <Card.Link href={"/view/" + reply.postId}>View this Post</Card.Link>
                                                    </Card.Body>
                                                </Card>
                                            </Row>
                                    )}

                                </Col>
                            </Row>
                        </Container>
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