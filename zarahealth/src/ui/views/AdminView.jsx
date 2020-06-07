import React, {useState, useEffect} from 'react';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import zaraHealthTheme from "../theme/index";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {Router, Route, Switch} from "react-router-dom";
import history from "../../core/misc/history";
import {useLocation} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import AdminSettings from "../components/Admin/AdminSettings";
import AdminStatistics from "../components/Admin/AdminStatistics";
import AdminBroadcast from "../components/Admin/AdminBroadcast";
import AdminUsers from "../components/Admin/AdminUsers";
import PeopleIcon from '@material-ui/icons/People';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import SettingsIcon from '@material-ui/icons/Settings';


const useStyles = makeStyles({
    body: {
        marginTop: 0,
        marginBottom: 0
    },
    bottom: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: '100%',
    },
    root: {
        width: '100%',
        flexGrow: 1,
    },
    barBack: {
        '&.MuiBottomNavigation-root': {
            backgroundColor: "white"
        },
    },
    bar: {
        '&.MuiBottomNavigationAction-root': {
            color: zaraHealthTheme.palette.primary.main
        },
        '&.Mui-selected': {
            color: zaraHealthTheme.palette.secondary.main
        },
    }
});

function AdminView() {
    const classes = useStyles();
    const location = useLocation();
    const currentPath = location.pathname;
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    const childPath = currentPath.split(parentPath).pop()
    const [value, setValue] = useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValue(childPath);
    }, [childPath]);

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <Router history={history}>
                    <MuiThemeProvider theme={zaraHealthTheme}>
                        <CssBaseline/>
                        <Switch>
                            <Route path="/settings/home" component={AdminStatistics}/>
                            <Route path="/settings/users" component={AdminUsers}/>
                            <Route path="/settings/broadcast" component={AdminBroadcast}/>
                            <Route path="/settings/settings" component={AdminSettings}/>
                        </Switch>
                    </MuiThemeProvider>
                </Router>
            </div>

            <div className={classes.bottom}>
                <BottomNavigation value={value} onChange={handleChange} className={classes.barBack}>
                    <BottomNavigationAction className={classes.bar} label="Estadísticas" value="/home" icon={<EqualizerIcon/>}
                                            onClick={() => history.replace(parentPath + "/home")}/>
                    <BottomNavigationAction className={classes.bar} label="Usuarios" value="/users"
                                            icon={<PeopleIcon/>}
                                            onClick={() => history.replace(parentPath + "/users")}/>
                    <BottomNavigationAction className={classes.bar} label="Avisos" value="/broadcast" icon={<AnnouncementIcon/>}
                                            onClick={() => history.replace(parentPath + "/broadcast")}/>
                    <BottomNavigationAction className={classes.bar} label="Ajustes" value="/settings" icon={<SettingsIcon/>}
                                            onClick={() => history.replace(parentPath + "/settings")}/>
                </BottomNavigation>
            </div>
        </div>
    );
}

export default AdminView;
