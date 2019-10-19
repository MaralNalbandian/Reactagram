// Router - Connect the pages and navigation of the site using BrowserRouter and Switch.
// Also used for pagination using :page as seen below in the <Route> Components.
// Handle intialisation of pagination by redirecting to /1 to begin with.
// Author(s) - Brendon
// Date - 18/10/19
import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

//Import Components
import Home from "./Home";
import PostDetailed from "./PostDetailed";
import NotFound from "./NotFound";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
import Leaderboard from "./Leaderboard";

const Router = () => (
    <>
        <Menu/>
        <BrowserRouter>
            <Switch>
                <Route exact path="/leaderboard" component={Leaderboard}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/:page" component={Home}/>
                <Route exact path="/view/:postId/:page" component={PostDetailed}/>
                <Redirect from="/" to="/1"/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    </>
);

export default Router;
