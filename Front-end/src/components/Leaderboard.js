import React from 'react';

class Leaderboard extends React.Component {
    constructor() {
        super()
        this.state ={
        }
    }

    componentWillMount(){
        fetch("http://localhost:80/api/user/leaderboard")
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
            {Object.keys(this.state.users).map(key => (
                <div className="leaderboard-element">
                    <div className="leaderboard-photo-wrapper">
                        <img className="leaderboard-photo" src={`https://brendon-aip-2019.s3-ap-southeast-2.amazonaws.com/${key}.jpg`} alt={key}></img>
                    </div>
                    <div className="leaderboard-user-wrapper">
                        <div className="leaderboard-user">{this.state.users[key].name}</div>
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