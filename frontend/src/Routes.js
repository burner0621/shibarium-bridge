import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import backgroundImage from './assets/images/background.png'
import Send from "./views/Send";

const Routes = () => {
    return (
        <div className="bg-cover"  style={{ backgroundImage: `url(${backgroundImage})`, height: "100vh", backgroundPosition: "center"}}>
          <Header />
          <Switch>
            <Route
              path="/"
              component={Send}
            />
          </Switch>
        </div>
      );
};

export default Routes;