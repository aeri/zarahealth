import React from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocalFloristIcon from "@material-ui/icons/LocalFlorist";
import DashboardIcon from "@material-ui/icons/Dashboard";
import OpacityIcon from "@material-ui/icons/Opacity";
import CloudIcon from "@material-ui/icons/Cloud";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: { 
      height: "calc(100vh - 48px)", 
    }, 
    [theme.breakpoints.up('sm')]: { 
      height: "calc(100vh - 64px)",
    },     
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}));

function ZaraHealthDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const drawerContent = (
    <div>
      <div className={classes.toolbar} />
      <div className={classes.sidebar}>
        <div className="top-nav">
          <Divider />
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                className={classes.avatar}
                src="https://avatars1.githubusercontent.com/u/3115756?s=460&u=f2730d80135af68a86e4e68b5e3b3e7849bb3471&v=4"
              />
            }
            action={
              <IconButton aria-label="settings">
                <ExitToAppIcon />
              </IconButton>
            }
            title="Pedro Malo"
            subheader="hola@pedromalo.dev"
          />
          <Divider />
          <List>
            <ListItem button key="Dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button key="Feed">
              <ListItemIcon>
                <RssFeedIcon />
              </ListItemIcon>
              <ListItemText primary="Feed" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="Polen">
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>
              <ListItemText primary="Polen" />
            </ListItem>
            <ListItem button key="Agua">
              <ListItemIcon>
                <OpacityIcon />
              </ListItemIcon>
              <ListItemText primary="Agua" />
            </ListItem>
            <ListItem button key="Aire">
              <ListItemIcon>
                <CloudIcon />
              </ListItemIcon>
              <ListItemText primary="Aire" />
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
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
  );
}

export default ZaraHealthDrawer;
