import React from 'react';

import { Card, Button, Row, Col, ListGroup, Container } from 'react-bootstrap';

class Reactions extends React.Component {
    setReactionCountStates() {
        var sum = 0;

        //check like
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == "like") {
                console.log("setting like: ", sum)
                sum = sum + 1;
            }
        }

        this.props.state.reactionCounts.like = sum;
        console.log("completed setting like", "to: ", sum)

        //check love
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == "love") {
                console.log("setting love: ", sum)
                sum = sum + 1;
            }
        }

        this.props.state.reactionCounts.love = sum;
        console.log("completed setting love", "to: ", sum)

        //check laugh
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == "laugh") {
                console.log("setting laugh: ", sum)
                sum = sum + 1;
            }
        }

        this.props.state.reactionCounts.laugh = sum;
        console.log("completed setting laugh", "to: ", sum)

        //check sad
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == "sad") {
                console.log("setting sad: ", sum)
                sum = sum + 1;
            }
        }

        this.props.state.reactionCounts.sad = sum;
        this.setState(this.props.state)
        console.log("completed setting sad", "to: ", sum)


        //check angry
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == "angry") {
                console.log("setting angry: ", sum)
                sum = sum + 1;
            }
        }

        this.props.state.reactionCounts.angry = sum;
        this.setState(this.props.state)
        console.log("completed setting angry", "to: ", sum)

    }
    
    getReactionCounts(type) {
        console.log("getReactionCounts", type)
        var sum = 0;
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
            if (this.props.state.post.reacts[i].reaction == type) {
                console.log("setting ", type, sum)
                sum = sum + 1;
            }
        }
        return sum;
    }

    handleReact(reactType) {
        console.log("reactype", reactType)

        this.setState({
            reaction: reactType
        },

            function updateReacts() {
                let operationComplete = false;

                //if logged in..
                if (this.props.state.userIdtoken != undefined) {
                    //if user is logged in

                    //check if user has reacted to this post already.
                    for (var i = 0; i < this.props.state.post.reacts.length; i++) {
                        if (this.props.state.post.reacts[i].userId == this.props.state.userIdtoken) {
                            console.log("user has reacted already");

                            //now check if the user's reaction is the same
                            //in this case REMOVE their reaction
                            console.log("this.props.state.reactType: ", this.state.reaction)
                            console.log("this.props.state.post.reacts[i].reaction: ", this.props.state.post.reacts[i].reaction)
                            if (this.state.reaction == this.props.state.post.reacts[i].reaction) {

                                console.log("the REACTION IS THE SAME AS EXISTING")
                                //REMOVE this object from the array
                                console.log("this.props.state.post.reacts[i].userId:", this.props.state.post.reacts[i].userId);
                                console.log("this.props.state.userIdtoken:", this.props.state.userIdtoken)

                                console.log("compare: ", this.props.state.userIdtoken == this.props.state.post.reacts[i].userId);

                                console.log("before: ", this.props.state.post.reacts)
                                var newArray = this.props.state.post.reacts.filter(object => object.userId != this.props.state.userIdtoken);
                                //need to post this to db after
                                console.log("after: ", newArray)

                                this.props.state.post.reacts = newArray;
                                this.props.state.post.numOfReacts = this.props.state.post.numOfReacts - 1;
                                operationComplete = true;
                            }
                            else {
                                //if their reaction is different
                                this.props.state.post.reacts[i].reaction = this.state.reaction;
                                operationComplete = true;
                            }

                        }
                    }
                    //now we've finished looping, if an operation has not been performed
                    //this means they don't have areaction already, so..
                    if (operationComplete != true) {
                        //user is making a new reaction
                        var tempReact = {
                            userId: this.props.state.userIdtoken,
                            reaction: this.state.reaction
                        }

                        console.log("tempReact", tempReact);

                        //push it into the post object in state
                        this.props.state.post.reacts.push(tempReact)
                        this.props.state.post.numOfReacts = this.props.state.post.numOfReacts + 1;
                        console.log('HIIIIIIIIIIIIIIIIIII')
                        console.log(this.props.state.post)
                    }

                    //this runs no matter what since we're just manipulating state except if not logged in
                    //POST state to database
                    fetch('http://localhost:80/api/post/react', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.props.state.post)
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

    render() {
        console.log('HI')
        console.log(this.props);
        return (
            <>
                <Row>
                        <Button style={{ fontSize: 15 }} variant="light" onClick={() => this.handleReact("like")}>👍</Button>
                    
                        <Button style={{ fontSize: 15 }} variant="light" onClick={() => this.handleReact("love")}>😍</Button>                 
                    
                        <Button style={{ fontSize: 15 }} variant="light" onClick={() => this.handleReact("laugh")}>😂</Button>                    
                    
                        <Button style={{ fontSize: 15 }} variant="light" onClick={() => this.handleReact("sad")}>😢</Button>                   
                    
                        <Button style={{ fontSize: 15 }} variant="light" onClick={() => this.handleReact("angry")}>😡</Button>
                    
                </Row>
                <Row>
                    <div className="reaction-counts">
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.props.state.reactionCounts.like : this.getReactionCounts("like")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.props.state.reactionCounts.love : this.getReactionCounts("love")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.props.state.reactionCounts.laugh : this.getReactionCounts("laugh")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.props.state.reactionCounts.sad : this.getReactionCounts("sad")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.props.state.reactionCounts.angry : this.getReactionCounts("angry")}
                        </h5>
                    </div>
                </Row>
            </>
        )
    }
}

export default Reactions;