// Leaderboard component - The leaderboard component renders some graphics to show the three users 
// that have performed the most uploads in the system
// Author(s) - Brendon
// Date - 18/10/19

import React from 'react';

class Leaderboard extends React.Component {
    state = {}

    //Fetch the users who are on the leaderboard before the components render and store these users in state
    componentWillMount(){
        fetch(process.env.REACT_APP_BACKEND_WEB_ADDRESS + "/api/user/leaderboard")
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ 
                users: responseJson
            })
        })
    }

    render() {
        if (!this.state.users){
            return (
                <p>Loading...</p>
            )
        }
        return (
        <div className="leaderboard">
            {/* Loop through the top 3 users and images associated with their position on the leaderboard */}
            {Object.keys(this.state.users).map(key => (
                <div className="leaderboard-element">
                    <div className="leaderboard-photo-wrapper">
                        <img className="leaderboard-photo" src={`https://brendon-aip-2019.s3-ap-southeast-2.amazonaws.com/${key}.jpg`} alt={key}></img>
                    </div>
                    <div className="leaderboard-user-wrapper">
                        {/* Prevent the entire username of users with longer names from being displayed */}
                        <div className="leaderboard-user">{this.state.users[key].name.substring(0,20)}</div>
                    </div>
                    <div className="leaderboard-upload-wrapper">
                        <div className="leaderboard-upload">Uploads: {this.state.users[key].uploads}</div>
                    </div>
                </div>
            ))}
        </div>
        )
    }
}

export default Leaderboard;