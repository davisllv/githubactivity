import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "./Context/AppContext";

//==========================COMPONENTES==========================
import Homepage from "./Pages/Homepage";
import Issues from "./Pages/Issues";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer autoClose={3000} pauseOnHover={false} />
      <AppProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/issues/:id" exact component={Issues} />
          </Switch>
        </Router>
      </AppProvider>
    </>
  );
};

export default App;
