import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

//Import Components
import Home from "./Home";
import PostDetailed from "./PostDetailed";
import NotFound from "./NotFound";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
<<<<<<< HEAD
import Register from "./Register";

const Router = () => (
  <>
    <Menu />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/view/:postId" component={PostDetailed} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  </>
=======
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
>>>>>>> develop
);

export default Router;
