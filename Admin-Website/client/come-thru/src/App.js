import SignIn from './signIn/SignIn';
import Students from './navbar/Students';
import Admins from './navbar/Admins';
import Guards from './navbar/Guards';
import Admin from './admin/Admin';
import Navbar from './navbar/Navbar';
import {Route,Switch,useLocation} from "react-router-dom";


function App() {
  const location = useLocation();

  return (
  <div className="App">
    <Navbar />
      <Switch location={location} key={location.key}>
        <Route exact path="/">
            <SignIn />
        </Route>
        <Route exact path="/Home">
            <Admin />
        </Route>
        <Route exact path="/Students">
            <Students />
        </Route>
        <Route exact path="/Admins">
            <Admins />
        </Route>
        <Route exact path="/Guards">
            <Guards />
        </Route>
      </Switch>
  </div> 
  );
}

export default App;
