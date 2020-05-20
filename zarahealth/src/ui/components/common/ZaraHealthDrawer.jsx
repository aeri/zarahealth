import React from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocalFloristIcon from "@material-ui/icons/LocalFlorist";
import DashboardIcon from "@material-ui/icons/Dashboard";
import OpacityIcon from "@material-ui/icons/Opacity";
import CloudIcon from "@material-ui/icons/Cloud";
import SettingsIcon from "@material-ui/icons/Settings";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LoginDialog from "../Auth/LoginDialog";
import history from "../../../core/misc/history";
import { useLocation } from "react-router-dom";
import UserCard from "../Auth/UserCard";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  sidebar: {
    height: "calc(100vh - 56px)",
    [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
      height: "calc(100vh - 48px)",
    },
    [theme.breakpoints.up("sm")]: {
      height: "calc(100vh - 64px)",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

function ZaraHealthDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const location = useLocation();

  const [isLoginDialogOpen, setLoginDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleClose = () => {
    setLoginDialogOpen(false);
  };

  const drawerContent = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.sidebar}>
        <div className="top-nav">
          <Divider />
          <UserCard
            handleClickOpen={handleClickOpen}
            mobileOpen={props.mobileOpen}
            handleDrawerToggle={props.handleDrawerToggle}
          />
          <Divider />
          <List>
            <ListItem
              button
              key="Dashboard"
              onClick={() => history.replace("/")}
              selected={location.pathname === "/"}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              key="Feed"
              onClick={() => history.replace("/feed")}
              selected={location.pathname === "/feed"}
            >
              <ListItemIcon>
                <RssFeedIcon />
              </ListItemIcon>
              <ListItemText primary="Feed" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key="Polen"
              onClick={() => history.replace("/pollen/info")}
              selected={location.pathname === "/pollen/info"}
            >
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>
              <ListItemText primary="Polen" />
            </ListItem>
            <ListItem
              button
              key="Agua"
              onClick={() => history.replace("/water/info")}
              selected={location.pathname === "/water/info"}
            >
              <ListItemIcon>
                <OpacityIcon />
              </ListItemIcon>
              <ListItemText primary="Agua" />
            </ListItem>
            <ListItem
              button
              key="Aire"
              onClick={() => history.replace("/air/info")}
              selected={location.pathname === "/air/info"}
            >
              <ListItemIcon>
                <CloudIcon />
              </ListItemIcon>
              <ListItemText primary="Aire" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key="Ajustes"
              onClick={() => history.replace("/settings")}
              selected={location.pathname === "/settings"}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Ajustes" />
            </ListItem>
          </List>
        </div>
        <div className="bottom-nav">
          <Divider />
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                Z
              </Avatar>
            }
            title="ZaraHealth"
            subheader="v. 0.1"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        <LoginDialog open={isLoginDialogOpen} handleClose={handleClose} />
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={props.mobileOpen}
            onClose={props.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default ZaraHealthDrawer;
