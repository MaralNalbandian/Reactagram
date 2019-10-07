import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Import Components
import Home from "./Home";
import PostDetailed from "./PostDetailed";
import NotFound from "./NotFound";
import Login from "./Login";
import Menu from "./Menu";
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
);

export default Router;
