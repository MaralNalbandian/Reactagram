// Reactions component - The reactions component is the 5 emojis and their associated functionality
// Whenever a user clicks on the emoji a logic flow takes place, based on what their history of reactions
// on this post is ; such as if they've reacted before or are now reacting differently.
// Author(s) - Jarrod
// Date - 18/10/19

import React from 'react';

import {Button, Row} from 'react-bootstrap';

class Reactions extends React.Component {
    state = {
        reactionCounts: {
            like: 0,
            love: 0,
            laugh: 0,
            sad: 0,
            angry: 0,
        }
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - setReactionCountStates
    // Description - Loops through each reaction in the array of objects "reacts" for this post
    //              ... checks what it is, adds each respective one to the correct state ReactionCount.X 
    // Parameters - N/A
    // Return - N/A
    // Example of usage - this.setReactionCountStates()
    setReactionCountStates() {
        var sum = 0;

        //check like
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === "like") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.like = sum;

        //check love
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === "love") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.love = sum;

        //check laugh
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === "laugh") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.laugh = sum;

        //check sad
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === "sad") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.sad = sum;
        this.setState(this.props.state)


        //check angry
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === "angry") {
                sum = sum + 1;
            }
        }

        this.state.reactionCounts.angry = sum;
        this.setState(this.props.state)

    }
    
    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - getReactionCounts
    // Description - Called on load of each post at the loading phase initially - loads from the 
    //                ... database what the initial counts of each reaction is. 
    //              ... checks what it is, adds each respective one to the correct state ReactionCount.X 
    // Parameters - type: e.g. happy/sad/angry/like/laugh - the type of reaction that the component is requestion information on.
    // Return - N/A
    // Example of usage - this.getReactionCounts("happy")
    getReactionCounts(type) {
        var sum = 0;
        for (var i = 0; i < this.props.state.post.reacts.length; i++) {
            if (this.props.state.post.reacts[i].reaction === type) {
                sum = sum + 1;
            }
        }
        return sum;
    }

    // Author(s) - Jarrod
    // Date - 18/09/19
    // Function - handleReact
    // Description - Increment/change/remove the reaction depending on what the user's history of reactions to this post is.
    // Parameters - reactType - e.g. happy/sad/angry/like/laugh
    // Return - N/A
    // Example of usage - this.handleReact("happy")
    handleReact(reactType) {

        this.setState({
            reaction: reactType
        },

            function updateReacts() {
                let operationComplete = false;

                //if logged in..
                if (this.props.state.userIdToken != undefined) {
                    //if user is logged in

                    //check if user has reacted to this post already.
                    for (var i = 0; i < this.props.state.post.reacts.length; i++) {
                        if (this.props.state.post.reacts[i].userId === this.props.state.userIdToken) {

                            //now check if the user's reaction is the same
                            //in this case REMOVE their reaction
                            if (this.state.reaction === this.props.state.post.reacts[i].reaction) {
                                //REMOVE this object from the array
                                var newArray = this.props.state.post.reacts.filter(object => object.userId != this.props.state.userIdToken);
                                //need to post this to db after

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
                            userId: this.props.state.userIdToken,
                            reaction: this.state.reaction
                        }

                        //push it into the post object in state
                        this.props.state.post.reacts.push(tempReact)
                        this.props.state.post.numOfReacts = this.props.state.post.numOfReacts + 1;
                    }

                    this.setState({reactCountsCanUseState: true})
                  
                    //this runs no matter what since we're just manipulating state except if not logged in
                    //POST state to database
                    fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + '/api/post/react', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.props.state.post)
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

    render() {
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
                            {this.props.state.reactCountsCanUseState ? this.state.reactionCounts.angry : this.getReactionCounts("angry")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.state.reactionCounts.sad : this.getReactionCounts("sad")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.state.reactionCounts.laugh : this.getReactionCounts("laugh")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.state.reactionCounts.love : this.getReactionCounts("love")}
                        </h5>
                        <h5 className="pull-right">
                            {this.props.state.reactCountsCanUseState ? this.state.reactionCounts.like : this.getReactionCounts("like")}
                        </h5>
                    </div>
                </Row>
            </>
        )
    }
}

export default Reactions;