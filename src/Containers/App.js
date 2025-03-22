import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import SignIn from "./SignIn/SignIn";
import Home from "./Home/Home";
import ViewOrders from "./ViewOrders/ViewOrders";
import NotFound from "./NotFound/NotFound";
import Header from "../Components/Header";
import DbApp from "../admin/dbApp"; 

//Wrapper ContextAPI AuthContext
export default function App() {
  const isLoggedIn = useSelector(
    (state) => {
      //Should be user
      const loggedInUser = JSON.parse(localStorage.getItem("redux"));
      return (
        (loggedInUser && !!loggedInUser.user.isLoggedIn) ||
        state.user.isLoggedIn
      );
    }
    // && state.user.jwt !== null
  );

  const userType =
    useSelector((state) => state.user.userType) ||
    JSON.parse(localStorage.getItem("redux"))?.user?.userType;
  console.log("User Type:", userType); // Debugging line

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn === true ? (
            <Component {...props} />
          ) : (
            <Redirect exact to="/" />
          )
        }
      />
    );
  };

  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      {userType === "o" && (
        <PrivateRoute path="/dashboard" component={DbApp} />
      )}
      {userType === "w" && (
        <Container maxWidth="xl">
        
          <Box style={{ marginBottom: "10px" }}>
            <Header isLoggedIn={isLoggedIn} />
          </Box>
          <Switch>
            {/* //routes should an arry of objects  */}
            {/* //routes.map(()=>{}) */}
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/viewOrders" component={ViewOrders} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

//constants
const USER_TYPE = {
  OWNER: "o",
  WORKER: "w",
};
