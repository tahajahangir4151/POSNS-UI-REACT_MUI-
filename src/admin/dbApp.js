import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Header from "./components/dbHeader";
import DashboardCards from "./components/DashboardCard";
import DashboardCharts from "./components/DashboardCharts";
import NotFound from "../Containers/NotFound/NotFound";
import SignIn from "../Containers/SignIn/SignIn";
import { getDataFromJson } from "../utils/getDataFromJson";

export default function DbApp() {
  const [isBaseUrlSet, setIsBaseUrlSet] = useState(false);

  useEffect(() => {
    const setBaseUrl = async () => {
      await getDataFromJson();
      setIsBaseUrlSet(true);
    };
    setBaseUrl();
  }, []);

  const data = useSelector((state) => state.user?.dashboardData?.data);
  console.log(data);

  const isLoggedIn = useSelector((state) => {
    const loggedInUser = JSON.parse(localStorage.getItem("redux"));
    return (
      (loggedInUser && !!loggedInUser.user.isLoggedIn) || state.currentUser.isLoggedIn
    );
  });

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

  if (!isBaseUrlSet) {
    return <></>;
  }

  return (
    <Container maxWidth="xl" style={{ padding: 0, margin: 0 }}>
      <Box style={{ padding: 0, margin: 0 }}>
        <Header isLoggedIn={isLoggedIn} data={data}/>
      </Box>
      <Switch>
        <Route exact path="/" component={SignIn} />
        <PrivateRoute
          path="/dashboard"
          component={() => (
            <Box>
              <DashboardCards data={data} />
              <DashboardCharts data={data} />
            </Box>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </Container>
  );
}
