<<<<<<< HEAD
import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
=======
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
>>>>>>> develop

//Import Components
import Home from "./Home";
import PostDetailed from "./PostDetailed";
import NotFound from "./NotFound";
import Login from "./Login";
import Menu from "./Menu";

const Router = () => (
    <>
        <Menu/>
        <BrowserRouter>
            <Switch>
                <Route exact path="/:page" component={Home}/>
                <Redirect from="/" to="/1"/>
                <Route exact path="/view/:postId" component={PostDetailed}/>
                <Route exact path="/login" component={Login} />
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    </>
);

export default Router;
