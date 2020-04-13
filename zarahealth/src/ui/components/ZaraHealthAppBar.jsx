import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar : {
    //margin: 0,
    zIndex: theme.zIndex.drawer + 1,
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
        <Typography variant="h6" className={classes.title}>
          ZaraHealth
        </Typography>
        <Typography variant="h6">23º</Typography>
        <CloudOutlinedIcon />
      </Toolbar>
    </AppBar>
  );
}

export default ZaraHealthAppBar;
