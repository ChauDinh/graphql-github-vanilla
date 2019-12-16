import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Profile from "../Profile";
import Organization from "../Organization";
import Navigation from "./Navigation";

import * as routes from "../constants/routes";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navigation />

          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  <Organization organizationName={"the-road-to-learn-react"} />
                </div>
              )}
            ></Route>
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_small-header">
                  <Profile />
                </div>
              )}
            ></Route>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
