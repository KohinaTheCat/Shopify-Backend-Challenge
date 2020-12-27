import Home from "../src/pages/Home/Home"
import Profile from "../src/pages/Profile/Profile"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
    </Router>

  );
}

export default App;
