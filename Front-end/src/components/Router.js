import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Import Components
import Home from "./Home";
import PostDetailed from "./PostDetailed";
import NotFound from "./NotFound";
import Register from "./Register";
import Login from "./Login";
import Discussion from "./Discussion";
import Leaderboard from "./Leaderboard";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/view/:postId" component={PostDetailed} />
      {/* <Route component={NotFound} /> */}
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/discussion" component={Discussion} />
      <Route exact path="/leaderboard" component={Leaderboard} />
    </Switch>
  </BrowserRouter>
);

export default Router;
