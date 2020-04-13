import React from "react";

import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";

import { Provider } from "react-redux";
import store from "./core/redux/store";

import ZaraHealthAppBar from "./ui/components/ZaraHealthAppBar.jsx";
import ZaraHealthDrawer from "./ui/components/ZaraHealthDrawer.jsx";
import zaraHealthTheme from "./ui/common/ZaraHealthTheme.js";

import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function ZaraHealth() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={zaraHealthTheme}>
        <div className={classes.root}>
          <ZaraHealthAppBar handleDrawerToggle={handleDrawerToggle} />
          <ZaraHealthDrawer
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <main>
            <Box m={1}></Box>
          </main>
        </div>
      </MuiThemeProvider>
    </Provider>
  );
}

export default ZaraHealth;
