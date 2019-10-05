import React from 'react';
import Post from './Post';
import AddPost from './addPost';
import { Card, Button, Row, Col, ListGroup, Container, ButtonToolbar, } from 'react-bootstrap';

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

    state = {
        reactionCounts: {
            like: 0,
            love: 0,
            laugh: 0,
            sad: 0,
            angry: 0,
        },
        replyObjects: [],
    }

    componentWillMount() {
        this.getPost()
            .then(() => this.getReplyObjects());


        //console.log("state after getPost", this.state)

        //console.log("getStorageToken: ", localStorage.getItem("the_main_app"))
        //if user is logged in :

        if (localStorage.getItem("the_main_app") != undefined) {
            this.setState({ token: JSON.parse(localStorage.getItem("the_main_app")).token })
            this.setState({ userIdtoken: JSON.parse(localStorage.getItem("the_main_app")).userIdtoken })
        }

        else {
            this.setState({ token: undefined })
            this.setState({ userIdtoken: undefined })

        }

        this.setState({ reactCountsCanUseState: false })
    }

    // componentDidMount() {
    //     console.log("state before getreplyobjects: ", this.state)
    //     this.getReplyObjects();
    //     console.log("state after getreplyobjects: ", this.state)
    // }

    getReactionCounts(type) {
        console.log("getReactionCounts", type)
        var sum = 0;
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == type) {
                // console.log("setting ", type, sum)
                sum = sum + 1;
            }
        }
        return sum;

    }

    setReactionCountStates() {
        var sum = 0;

        //check like
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == "like") {
                console.log("setting like: ", sum)
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.like = sum;
        this.setState(this.state)
        // console.log("completed setting like", "to: ", sum)

        //check love
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == "love") {
                console.log("setting love: ", sum)
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.love = sum;
        this.setState(this.state)
        // console.log("completed setting love", "to: ", sum)

        //check laugh
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == "laugh") {
                console.log("setting laugh: ", sum)
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.laugh = sum;
        this.setState(this.state)
        // console.log("completed setting laugh", "to: ", sum)

        //check sad
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == "sad") {
                // console.log("setting sad: ", sum)
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.sad = sum;
        this.setState(this.state)
        // console.log("completed setting sad", "to: ", sum)


        //check angry
        for (var i = 0; i < this.state.post.reacts.length; i++) {
            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
            if (this.state.post.reacts[i].reaction == "angry") {
                // console.log("setting angry: ", sum)
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.angry = sum;
        this.setState(this.state);
        // console.log("completed setting angry", "to: ", sum)

    }

    handleReact(reactType) {
        console.log("reactype", reactType)

        this.setState({
            reaction: reactType
        },

            function updateReacts() {
                let operationComplete = false;

                //if logged in..
                if (this.state.userIdtoken != undefined) {
                    //if user is logged in

                    //check if user has reacted to this post already.
                    for (var i = 0; i < this.state.post.reacts.length; i++) {
                        if (this.state.post.reacts[i].userId == this.state.userIdtoken) {
                            console.log("user has reacted already");

                            //now check if the user's reaction is the same
                            //in this case REMOVE their reaction
                            // console.log("this.state.reactType: ", this.state.reaction)
                            // console.log("this.state.post.reacts[i].reaction: ", this.state.post.reacts[i].reaction)
                            if (this.state.reaction == this.state.post.reacts[i].reaction) {

                                // console.log("the REACTION IS THE SAME AS EXISTING")
                                //REMOVE this object from the array
                                // console.log("this.state.post.reacts[i].userId:", this.state.post.reacts[i].userId);
                                // console.log("this.state.userIdtoken:", this.state.userIdtoken)

                                // console.log("compare: ", this.state.userIdtoken == this.state.post.reacts[i].userId);

                                // console.log("before: ", this.state.post.reacts)
                                var newArray = this.state.post.reacts.filter(object => object.userId != this.state.userIdtoken);
                                //need to post this to db after
                                // console.log("after: ", newArray)

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
                            userId: this.state.userIdtoken,
                            reaction: this.state.reaction
                        }

                        console.log("tempReact", tempReact);

                        //push it into the post object in state
                        this.state.post.reacts.push(tempReact)
                        this.state.post.numOfReacts = this.state.post.numOfReacts + 1;
                        console.log('HIIIIIIIIIIIIIIIIIII')
                        console.log(this.state.post)
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
                        .catch((error) => console.log(error))
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
                    username: post.username,
                    imageLink: post.imageLink
                }
                //2. Also Update the replies of this post
            });
        }
        catch (error) {
            console.log("im a degenerate")
        }
        // .then(
        // () => 
        this.updateReplies(dateNow);
        // .then(
        // 3. Retrieve all the posts using the API
        // () => this.getPosts()
        // )
        // );
    };

    updateReplies(dateId) {

        //push postId to replies array
        console.log("before arra: state.post.replies", this.state.post.replies)
        this.state.post.replies.push(`post${dateId}`)
        console.log("after arra: state.post.replies", this.state.post.replies)

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
            .catch((error) => console.log(error))

    };


    handleEdit() {
        console.log("handleEdit");
    }

    handleDelete() {
        console.log("handleDelete")

        fetch('http://localhost:80/api/post/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => window.alert("Post Succesfully Deleted"))
            .catch((error) => console.log(error))

        this.setState(this.state); //refresh state 

    }

    handleDeleteWithPlaceholder() {
        console.log("handleDeleteWithPlaceholder")
    }

    renderButtons() {
        //if logged in..
        if (this.state.userIdtoken != undefined) {

            //if this is this user's post
            if (this.state.userIdtoken == this.state.post.userId) {

                //1. Check if post has no reacts and no replies
                if (this.state.post.replies.length == 0 && this.state.post.reacts.length == 0) {
                    //has no reacts and no replies: return both buttons
                    return (
                        <div>
                            <ButtonToolbar>
                                <Button variant="primary" className="pull-right" onClick={() => this.handleEdit()}>EDIT POST</Button>
                                <Button variant="primary" className="pull-right" onClick={() => this.handleDelete()}>DELETE POST</Button>
                            </ButtonToolbar>
                        </div>
                    )
                }


                //2. Check if this post has reaction
                if (this.state.post.reacts.length != 0) {
                    //post has reaction, can be deleted but not changed
                    return (
                        <div>
                            <ButtonToolbar>
                                <Button variant="primary" className="pull-right" onClick={() => this.handleDelete()}> DELETE POST</Button>
                            </ButtonToolbar>
                        </div>
                    )
                }


                //3. Check if this post has reply
                if (this.state.post.replies.length == 0 && this.state.post.reacts.length != 0) {
                    //has a reply: can be replaced by a holder saying it has been "deleted"
                    return (
                        <div>
                            <ButtonToolbar>
                                {/* <Button variant="primary" className="pull-right">EDIT POST</Button> */}
                                <Button variant="primary" className="pull-right" onClick={() => this.handleDeleteWithPlaceholder()}>DELETE POST</Button>
                            </ButtonToolbar>
                        </div>
                    )
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
        console.log("GETREPLYOBJECTS CALLED")

        //make a fetch call for each postId in this.post.replies
        //debugger;
        console.log("replyes langth: ", this.state.post.replies.length)
        console.log("replies before promise: ", this.state.post.replies)

        //debugger;

        //set state now

        //loop a fetch request
        for (var i = 0; i < this.state.post.replies.length; i++) {
            //var getLink = 'http://localhost:80/api/post/get/$' + this.state.post.replies
            axios.get(`http://localhost:80/api/post/get/${this.state.post.replies[i]}`)
                .then((response) => {
                    //this.setState({ post: response.data })
                    this.state.replyObjects.push(response.data)
                    console.log(response.data)
                    console.log("replyObjects: ", this.state.replyObjects)
                    this.setState(this.state) //refresh state
                    console.log(this.state)
                    this.getPost();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        

    }

    render() {
        //get total amounts of reactions
        //this.getReactionCounts();
        const id = this.props.match.params.postId;

        //get replies into an array of objects in state called "replyObjects"

        if (this.state.post) {
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
                                        <Card.Title>Post by {this.state.post.userId}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">At {this.state.post.date}</Card.Subtitle>
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
                                            {/* <h2>Add Reply</h2> */}
                                            <AddPost addPost={this.addPost} />
                                        </Card.Body>
                                    </Card>

                                </Col>
                            </Row>

                        </Container>

                        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>


                            {/* begin replies */}

                            <Row id="replies" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                                <Col xs={8} >
                                    {console.log("cuntcuntcunt", this.state.replyObjects)}

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
                                                        <Card.Title>Reply by {reply.username}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">At {reply.date}</Card.Subtitle>
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