import React, {useState, useEffect} from 'react';
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
import AirInfoStation from "../components/StationsData/Air/AirInfoStation";
import AirStatisticsStation from "../components/StationsData/Air/AirStatisticsStation";
import AirStationsMap from "../components/StationsData/Air/AirStationsMap";
import PollenInfoStation from "../components/StationsData/Pollen/PollenInfoStation";
import PollenStatisticsStation from "../components/StationsData/Pollen/PollenStatisticsStation";
import WaterInfoStation from "../components/StationsData/Water/WaterInfoStation";
import WaterStatisticsStation from "../components/StationsData/Water/WaterStatisticsStation";
import WaterStationsMap from "../components/StationsData/Water/WaterStationsMap";


const useStyles = makeStyles({
    body: {
        marginTop:0,
        marginBottom:0
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

function StationsDataView() {
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
                            <Route path="/air/map" component={AirStationsMap}/>
                            <Route path="/air/info" component={AirInfoStation}/>
                            <Route path="/air/stats" component={AirStatisticsStation}/>
                            <Route path="/pollen/info" component={PollenInfoStation}/>
                            <Route path="/pollen/stats" component={PollenStatisticsStation}/>
                            <Route path="/water/map" component={WaterStationsMap}/>
                            <Route path="/water/info" component={WaterInfoStation}/>
                            <Route path="/water/stats" component={WaterStatisticsStation}/>
                        </Switch>
                    </MuiThemeProvider>
                </Router>
            </div>

            <div className={classes.bottom}>
                <BottomNavigation value={value} onChange={handleChange} className={classes.barBack}>
                    {parentPath === '/air' || parentPath === '/water' ?
                        <BottomNavigationAction className={classes.bar} label="Mapa" value="/map" icon={<MapIcon/>}
                                                onClick={() => history.replace(parentPath + "/map")}/>
                        : null}
                    <BottomNavigationAction className={classes.bar} label="Info" value="/info" icon={<InfoIcon/>}
                                            onClick={() => history.replace(parentPath + "/info")}/>
                    <BottomNavigationAction className={classes.bar} label="Estadísticas" value="/stats"
                                            icon={<EqualizerIcon/>}
                                            onClick={() => history.replace(parentPath + "/stats")}/>
                </BottomNavigation>
            </div>
        </div>
    );
}

export default StationsDataView;
