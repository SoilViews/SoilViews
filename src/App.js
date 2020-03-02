import React, {useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';
import Nabvar from '../src/components/layout/Navbar'
import Dashboard from '../src/components/dashboard/Dashboard'
import indexPage from '../src/components/index/indexPage'
import SignIn from './components/auth/SignIn'
import ResetPassword from './components/auth/ResetPassword'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject'
import Footer from './components/layout/Footer'
import Profile from '../src/components/Profile/profile'
import ContactForm from '../src/components/ContactForm/ContactForm'
import Documentation from "./components/Help/HelpPage";
// import FileUpload from "./components/FileUpload/index";


function App() {


  const [checked] = useState(true);

  return (
    <BrowserRouter>
      <div className={checked ? "isActive" : "isInactive"}>
        <div className='App' >
          <header>
          
            <Nabvar></Nabvar>
            <Switch>
              <Route path='/indexPage' component={indexPage} />
              <Route path='/SignIn' component={SignIn} />
              <Route path='/SignUp' component={SignUp} />
              <Route path='/CreateProject' component={CreateProject} />
              <Route path='/Dashboard' component={Dashboard} />
              <Route path='/Profile' component={Profile} />
              <Route path='/ResetPassword' component={ResetPassword} />
              <Route path='/ContactForm' component={ContactForm}/>
              <Route path='/HelpPage' component={Documentation}/>
              <Route path="/" component={indexPage} />
            </Switch>
          </header>
          <Footer/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
