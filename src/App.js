import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Nabvar from "../src/components/layout/Navbar";
import Dashboard from "../src/components/dashboard/Dashboard";
import indexPage from "../src/components/index/indexPage";
import SignIn from "./components/auth/SignIn";
import ResetPassword from "./components/auth/ResetPassword";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import Footer from "./components/layout/Footer";
import Profile from "../src/components/Profile/profile";
import ContactForm from "../src/components/ContactForm/ContactForm";
import Documentation from "./components/Help/HelpPage";
import AdminPanel from "./components/Admin/AdminPanel";
import EditUser from "./components/Admin/EditUser";
import EditOrder from "./components/MyOrders/EditOrder";
import Wizard from "./components/Wizard/Wizard";
import PersistentDrawerLeft from "./components/DrawerLeft/PersistentDrawerLeft";
import MyOrders from "./components/MyOrders/MyOrders";

function App() {
  const [checked] = useState(true);

  return (
    <BrowserRouter>
      <div className={checked ? "isActive" : "isInactive"}>
        <div className="App">
          <header>
            {/* Sidenav */}
            <div className="hide-on-large-only" style={{ paddingTop: "50px" }}>
              <PersistentDrawerLeft />
            </div>
            {/* Sidenav */}
            <div className="hide-on-med-and-down">
              <Nabvar />
            </div>
            <Switch>
              <Route path="/indexPage" component={indexPage} />
              <Route path="/edit/:id" component={EditUser} />
              <Route path="/editOrder/:id" component={EditOrder} />
              <Route path="/SignIn" component={SignIn} />
              <Route path="/SignUp" component={SignUp} />
              <Route path="/CreateProject" component={CreateProject} />
              <Route path="/Dashboard" component={Dashboard} />
              <Route path="/Profile" component={Profile} />
              <Route path="/ResetPassword" component={ResetPassword} />
              <Route path="/ContactForm" component={ContactForm} />
              <Route path="/HelpPage" component={Documentation} />
              <Route path="/AdminPanel" component={AdminPanel} />
              <Route path="/NewOrder" component={Wizard} />
              <Route path="/MyOrders" component={MyOrders} />
              <Route path="/" component={indexPage} />
            </Switch>
          </header>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
