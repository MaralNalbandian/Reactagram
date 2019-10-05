import React from 'react';
import Post from './Post';
import AddPost from './addPost';
import Reactions from './Reactions'
import { Card, Button, Row, Col, ListGroup, Container } from 'react-bootstrap';

import axios from 'axios';

class PostDetailed extends React.Component {
    getPost() {
        axios.get(`http://localhost:80/api/post/get/${this.props.match.params.postId}`)
            .then((response) => {
                this.setState({ post: response.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentWillMount() {
        this.getPost();
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

    addPost = post => {
        // 1. Add our new post using the API
        axios("http://localhost:80/api/post/add", {
            method: "post",
            data: {
                postId: `post${Date.now()}`,
                username: post.username,
                imageLink: post.imageLink
            }
            //2. Also Update the replies of this post
        })
            .then(
                () => this.updateReplies()
                    .then(
                        // 3. Retrieve all the posts using the API
                        () => this.getPosts()
                    )
            );
    };

    updateReplies() {
        //manipulate state's replies by appending a new "post reply" object...
        var tempReply = {
            postId: `post${Date.now()}`,
            userId: this.state.userIdtoken,
            //imageLink: post.imageLink,
        }

        this.state.post.replies.push(tempReply)

        fetch('http://localhost:80/api/post/react', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.post)
        })
            .then(() => console.log("success"))
            .catch((error) => console.error(error))

    };


    render() {
        //get total amounts of reactions
        //this.getReactionCounts();

        const id = this.props.match.params.postId;
        if (this.state.post) {
            // { this.getReactionCounts("like") }
            return (
                <div className="photo-grid" >

                    {/* // Begin Post Section */}
                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <Row>
                            <Col xs={8}>
                                <Card style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400,

                                }}
                                    key={id}>
                                    <Card.Title>Post by {this.state.post.username}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">At {this.state.post.date}</Card.Subtitle>
                                    <Card.Img variant="bottom" src={this.state.post.imageLink} />

                                    <Card.Body>
                                    <div className="detailed-reactions">
                                        <Reactions state={this.state}/>
                                    </div>
                                    </Card.Body>

                                    <Card.Body>
                                        {/* Reply Form Goes Here */}
                                        <h2>Add Reply</h2>
                                        {/* <AddPost addPost={this.addPost} /> */}
                                    </Card.Body>
                                </Card>

                            </Col>
                        </Row>

                    </Container>

                    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                        {/* begin replies */}

                        <Row id="replies" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                            <Col xs={8} >

                                {this.state.post.replies.map(
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