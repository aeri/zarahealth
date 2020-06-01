import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { makeStyles } from "@material-ui/core/styles";
import zgzh from "../../shared/zgzh.svg";
import zaraHealthTheme from "../../theme";
import WeatherDisplay from "./WeatherDisplay";



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    //margin: 0,
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: zaraHealthTheme.palette.primary.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  title: {
    flexGrow: 1,
  },
}));

function ZaraHealthAppBar(props) {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <IconButton
          onClick={props.handleDrawerToggle}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.title}>
          <img src={zgzh} alt="ZGZh Logo" height={23} />
        </div>
        <WeatherDisplay />
      </Toolbar>
    </AppBar>
  );
}

export default ZaraHealthAppBar;
