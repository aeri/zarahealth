import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import history from "./core/misc/history";
import { useSelector } from "react-redux";

import ZaraHealthAppBar from "./ui/components/ZaraHealthAppBar.jsx";
import ZaraHealthDrawer from "./ui/components/ZaraHealthDrawer.jsx";
import AlertDialog from "./ui/components/AlertDialog";
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

  const alert = useSelector((state) => state.alertReducer);

  return (
    <MuiThemeProvider theme={zaraHealthTheme}>
      <ZaraHealthAppBar handleDrawerToggle={handleDrawerToggle} />
      <div className={classes.root}>
        <ZaraHealthDrawer
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        {alert.type && (
          <AlertDialog
            type={alert.type}
            message={alert.message}
          />
        )}

        <main>
          <Box m={1}>
            <Router history={history}>
              <Switch>
                <Route exact path="/" component={DashboardView} />
                <Route path="/feed" component={FeedView} />
                <Route path="/settings" component={SettingsView} />
                <Redirect from="*" to="/" />
              </Switch>
            </Router>
          </Box>
        </main>
      </div>
    </MuiThemeProvider>
  );
}

export default ZaraHealth;
