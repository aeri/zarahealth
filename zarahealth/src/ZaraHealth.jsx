import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import history from "./core/misc/history";

import ZaraHealthAppBar from "./ui/components/ZaraHealthAppBar.jsx";
import ZaraHealthDrawer from "./ui/components/ZaraHealthDrawer.jsx";
import zaraHealthTheme from "./ui/common/ZaraHealthTheme.js";
import DashboardView from "./ui/views/DashboardView";
import FeedView from "./ui/views/FeedView";
import SettingsView from "./ui/views/SettingsView";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

function ZaraHealth() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <Router history={history}>
      <MuiThemeProvider theme={zaraHealthTheme}>
        <ZaraHealthAppBar handleDrawerToggle={handleDrawerToggle} />
        <div className={classes.root}>
          <ZaraHealthDrawer
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <main>
            <Box m={1}>
              <Switch>
                <Route exact path="/" component={DashboardView} />
                <Route path="/feed" component={FeedView} />
                <Route path="/settings" component={SettingsView} />
                <Redirect from="*" to="/" />
              </Switch>
            </Box>
          </main>
        </div>
      </MuiThemeProvider>
    </Router>
  );
}

export default ZaraHealth;
