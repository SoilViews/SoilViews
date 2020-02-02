import React, {useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';
import Nabvar from '../src/components/layout/Navbar'
import NotFoundPage from '../src/components/layout/NotFoundPage'
import Dashboard from '../src/components/dashboard/Dashboard'
import ProjecDetails from './components/projects/ProjectDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject'
import EditProject from './components/projects/EditProject'
import Footer from './components/layout/Footer'

function App() {


  const [checked, changeBackground] = useState(true);

  return (
    <BrowserRouter>
      <div className={checked ? "isActive" : "isInactive"}>
        <div className='App' >
          <header>
          <button className="change-background-btn" type="button" onClick={() => changeBackground(!checked)}>Change Website Colors</button>
            <Nabvar></Nabvar>
            <Switch>
              <Route path='/project/:id' component={ProjecDetails} />
              <Route path='/edit/:id' component={EditProject} />
              <Route path='/SignIn' component={SignIn} />
              <Route path='/SignUp' component={SignUp} />
              <Route path='/CreateProject' component={CreateProject} />
              <Route path='/Dashboard' component={Dashboard} />
              <Route path="/" component={SignIn} />
            </Switch>
          </header>
          <Footer/>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
