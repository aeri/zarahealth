import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import zaraHealthTheme from "../../theme";
import ApartmentIcon from '@material-ui/icons/Apartment';
import Grid from "@material-ui/core/Grid";
import WifiIcon from '@material-ui/icons/Wifi';
import {makeStyles} from '@material-ui/core/styles';
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";

const ExpansionPanel = withStyles({
    root: {

        border: zaraHealthTheme.palette.primary.main,
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: "white",
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 70,
        '&$expanded': {
            minHeight: 70,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: "100%",
            height: theme.spacing(20),
        },
    },
}));

export default function StatisticsStations() {
    const [expanded, setExpanded] = React.useState('panel0');
    const classes = useStyles();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const fakeStations = [{
        name: "Estación 0",
        lastUpdate: "hace 50 min",
        statistics: []
    },
        {
            name: "Estación 1",
            lastUpdate: "hace 50 min",
            statistics: []
        },
        {
            name: "Estación 2",
            lastUpdate: "hace 50 min",
            statistics: []
        }];
    const [stations, setStations] = useState(fakeStations);

    return (
        <div>
            <List>
                {stations.map((station, index) => {
                    return (
                        <ExpansionPanel square expanded={expanded === 'panel' + index}
                                        onChange={handleChange('panel' + index)}>
                            <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Grid container spacing={3} direction="row"
                                      justify="center"
                                      alignItems="center">
                                    <Grid item xs={1}>
                                        <ApartmentIcon
                                            style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                            {station.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item xs={3}>
                                                <WifiIcon
                                                    style={{fontSize: 30, verticalAlign: "middle",}} color="primary"/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography style={{paddingLeft: 8}} color="primary">
                                                    <Box fontWeight="fontWeightMedium" fontSize={10} color="#2f3542">
                                                        {station.lastUpdate}
                                                    </Box>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={1} direction="column"
                                      justify="center"
                                      alignItems="center">
                                    <Grid container spacing={1} direction="row"
                                          justify="center"
                                          alignItems="center">
                                        <Grid item xs={12}>
                                            <BarChart/>
                                        </Grid>

                                    </Grid>
                                    <Grid container spacing={1} direction="row"
                                          justify="center"
                                          alignItems="center">
                                        <Grid item xs={12}>
                                            <PieChart/>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })}
            </List>
        </div>
    );
}
