import React from 'react';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import zaraHealthTheme from "../theme/index";
import MapIcon from '@material-ui/icons/Map';
import InfoIcon from '@material-ui/icons/Info';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {Router, Route, Switch} from "react-router-dom";
import history from "../../core/misc/history";
import {useLocation} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import MapboxGLMap from "../components/StationsData/MapStations.jsx";
import AirInfoStation from "../components/StationsData/Air/AirInfoStation";
import AirStatisticsStation from "../components/StationsData/Air/AirStatisticsStation";
import PollenInfoStation from "../components/StationsData/Pollen/PollenInfoStation";
import PollenStatisticsStation from "../components/StationsData/Pollen/PollenStatisticsStation";
import WaterInfoStation from "../components/StationsData/Water/WaterInfoStation";
import WaterStatisticsStation from "../components/StationsData/Water/WaterStatisticsStation";


const useStyles = makeStyles({
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

function StationsDataView() {
    const classes = useStyles();
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const location = useLocation();
    const currentPath = location.pathname;
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    return (
        <div className={classes.root}>
            <Router history={history}>
                <MuiThemeProvider theme={zaraHealthTheme}>
                    <CssBaseline/>
                    <Switch>
                        <Route exact path="*/map" component={MapboxGLMap}/>
                        <Route path="/air/info" component={AirInfoStation}/>
                        <Route path="/air/stats" component={AirStatisticsStation}/>
                        <Route path="/pollen/info" component={PollenInfoStation}/>
                        <Route path="/pollen/stats" component={PollenStatisticsStation}/>
                        <Route path="/water/info" component={WaterInfoStation}/>
                        <Route path="/water/stats" component={WaterStatisticsStation}/>
                    </Switch>
                </MuiThemeProvider>
            </Router>

            <div className={classes.bottom}>
                <BottomNavigation value={value} onChange={handleChange} className={classes.barBack}>
                    <BottomNavigationAction className={classes.bar} label="Mapa" value="recents" icon={<MapIcon/>}
                                            onClick={() => history.replace(parentPath + "/map")}/>
                    <BottomNavigationAction className={classes.bar} label="Info" value="favorites" icon={<InfoIcon/>}
                                            onClick={() => history.replace(parentPath + "/info")}/>
                    <BottomNavigationAction className={classes.bar} label="Estadísticas" value="nearby"
                                            icon={<EqualizerIcon/>}
                                            onClick={() => history.replace(parentPath + "/stats")}/>
                </BottomNavigation>
            </div>
        </div>
    );
}

export default StationsDataView;
