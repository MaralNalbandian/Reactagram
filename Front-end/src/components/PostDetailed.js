import React from 'react';
import Post from './Post'
import { Card, Button, Row, Col, ListGroup, Container } from 'react-bootstrap';


class PostDetailed extends React.Component {
    getPost() {
        fetch(`http://localhost:80/api/post/get/${this.props.match.params.postId}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ post: responseJson })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentWillMount() {
        this.getPost();
        console.log(this.state)
    }

    state = {}


    handleReact(reactType) {
        console.log("reactype", reactType)
        this.setState({
            reaction: reactType
        },


            function updateReacts() {

                // // LOGIC FLOW:
                // // IF LOGGED IN:

                // if (user.loggedIn) {

                // //check if user has reacted to this post already
                // if (this logged in user's id is found in any of the react objects id fields) {
                //compare this.state.reactType with found reaction object's reaction field
                //if they're the same:
                //remove this object from state
                //post state to db

                //if they're different: 
                //CHANGE this reaction field in state to this.state.reactType
                //post state to db


                // }

                // // if they dont have a reaction yet
                //use existing code to add the reaction
                // else {

                // }

                // else {
                // // user is not loggedin 
                //pop up toast message saying that only logged in users can use this functionality
                //}




                var tempReact = {
                    username: this.state.post.username, //this is wrong but temporary while maral implements login
                    reaction: this.state.reaction
                }
                console.log("tempReact", tempReact);

                //push it into the post object in state
                this.state.post.reacts.push(tempReact)
                console.log(this.state.post)

                //POST state to database
                fetch('http://localhost:80/api/post/react', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.state.post)
                })
                    .then(() => console.log("success"))
                    .catch((error) => console.log(error))
            }

        )
    }

    handleReply() {

    }


    renderPost() {
        console.log("state:", this.state)
        console.log("replies: ", this.state.post.replies)
        return (

            // Begin Post Section
            <Container style={{
                backgroundColor: '#DCDCDC',
                justifyContent: 'center', alignItems: 'center',
            }}>
                <Row
                    style={{
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                    <Col></Col>

                    <Col xs={8}
                        style={{
                            backgroundColor: '#F8F8FF',
                            justifyContent: 'center', alignItems: 'center',
                        }}>

                        <Card style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', width: 300,
                        }}>
                            <Card.Title>Post by {this.state.post.username}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">At {this.state.post.date}</Card.Subtitle>
                            <Card.Img variant="bottom" src={this.state.post.imageLink} />
                            <Card.Body>
                                <Button variant="light" onClick={() => this.handleReact("like")}>👍</Button>
                                <Button variant="light" onClick={() => this.handleReact("love")}>😍</Button>
                                <Button variant="light" onClick={() => this.handleReact("laugh")}>😂</Button>
                                <Button variant="light" onClick={() => this.handleReact("sad")}>😢</Button>
                                <Button variant="light" onClick={() => this.handleReact("angry")}>😡</Button>
                            </Card.Body>
                            <Card.Body>
                                <Button
                                    variant="primary"
                                    className="pull-right"
                                // onClick={() => this.handleReply()}
                                >
                                    Reply
                                </Button>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col></Col>
                </Row>

                {/* begin replies */}
                <Row
                    id="replies">

                    {/* aim to map out each reply into a card */}
                    {this.state.post.replies.map(
                        reply => <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={reply.imageLink}
                                href="jeff" />
                            <Card.Body>
                                <Card.Title>Reply by {reply.username}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">At {reply.date}</Card.Subtitle>
                                {/* have to go to the actual post to reply to it. Reply is not directly avaialble from the comments. */}
                                <Card.Link href={"/view/" + reply.postId}>Card Link</Card.Link>
                            </Card.Body>
                        </Card>
                    )}

                </Row>
            </Container>
        )
    }

    render() {
        if (this.state.post) {
            return (
                this.renderPost()
            )
        }
        else {
            return (
                <Container>
                    Post not found...
                </Container>
            )
        }

    }
}

export default PostDetailed;