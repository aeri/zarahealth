import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import history from "./core/misc/history";
import ZaraHealthAppBar from "./ui/components/common/ZaraHealthAppBar.jsx";
import ZaraHealthDrawer from "./ui/components/common/ZaraHealthDrawer.jsx";
import zaraHealthTheme from "./ui/theme/index";
import DashboardView from "./ui/views/DashboardView";
import FeedView from "./ui/views/FeedView";
import CssBaseline from "@material-ui/core/CssBaseline";
import StationsDataView from "./ui/views/StationsDataView";
import {
  registerFCMToken,
  registerFCMTokenRefreshCallback,
  initializeFirebase,
} from "./core/services/fcm";
import { SettingsRouter } from "./ui/views/SettingsRouter";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    position: "relative",
  },
  root2: {
    position: "relative",
    width: "100%",
  },
}));

function ZaraHealth() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    initializeFirebase();
    registerFCMToken();
    registerFCMTokenRefreshCallback();
  }, []);

  return (
    <Router history={history}>
      <MuiThemeProvider theme={zaraHealthTheme}>
        <CssBaseline />
        <div className={classes.root}>
          <ZaraHealthDrawer
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <main className={classes.root2}>
            <ZaraHealthAppBar handleDrawerToggle={handleDrawerToggle} />
            <Box m={0}>
              <Switch>
                <Route exact path="/" component={DashboardView} />
                <Route path="/feed" component={FeedView} />
                {/* <Route path="/settings" component={SettingsView} /> */}
                <Route path="/settings" component={SettingsRouter} />
                <Route path="/pollen" component={StationsDataView} />
                <Route path="/water" component={StationsDataView} />
                <Route path="/air" component={StationsDataView} />
                {/* <Route path="/admin" component={AdminView} /> */}
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
