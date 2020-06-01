import React from "react";
import {Box, Typography, withStyles} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import zaraHealthTheme from "../../theme";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import GroupIcon from '@material-ui/icons/Group';
import CheckIcon from '@material-ui/icons/Check';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import LoopIcon from '@material-ui/icons/Loop';
import Metric from "./Statistics/Metric";
import Activities from "./Statistics/Activities";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Query} from "@apollo/react-components";
import gql from "graphql-tag";

const GET_ADMIN_STATS = gql`
  {
    retrieveMetrics {
      users
      activeUsers
      feeds
      activities {
        type
        count
      }
    }
  }
`;


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
}));

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

const styles = {
    marginBottom: 70
};

export default function AdminStatistics() {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div style={styles}>
            <Box m={1}>
                <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                    <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                        Estadísticas
                    </Box>
                </Typography>
            </Box>
            <Query query={GET_ADMIN_STATS}>
                {({data, loading, error}) => {
                    if (loading) {
                        return (
                            <div style={{
                                position: "absolute",
                                top: "15%",
                                left: "45%",
                                width: "100%",
                            }}>
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }

                    if (error) {
                        return <h2 style={{color: "white"}}>Error: {JSON.stringify(error)}</h2>;
                    }

                    if (data) {

                        return (
                            <div>

                                <ExpansionPanel square expanded={expanded === 'panel1'}
                                                onChange={handleChange('panel1')}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                                           aria-controls="panel1d-content"
                                                           id="panel1d-header">
                                        <Grid container spacing={3} direction="row"
                                              justify="center"
                                              alignItems="center">
                                            <Grid item xs={1}>
                                                <GroupIcon
                                                    style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                                    Usuarios registrados
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <Metric metric={{value: data.retrieveMetrics.users, title: 'usuarios registrados en el sistema'}}/>
                                </ExpansionPanel>

                                <ExpansionPanel square expanded={expanded === 'panel2'}
                                                onChange={handleChange('panel2')}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                                           aria-controls="panel1d-content"
                                                           id="panel1d-header">
                                        <Grid container spacing={3} direction="row"
                                              justify="center"
                                              alignItems="center">
                                            <Grid item xs={1}>
                                                <CheckIcon
                                                    style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                                    Usuarios token no expirado
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <Metric metric={{value: data.retrieveMetrics.activeUsers, title: 'usuarios cuyo token no ha caducado'}}/>
                                </ExpansionPanel>

                                <ExpansionPanel square expanded={expanded === 'panel3'}
                                                onChange={handleChange('panel3')}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                                           aria-controls="panel1d-content"
                                                           id="panel1d-header">
                                        <Grid container spacing={3} direction="row"
                                              justify="center"
                                              alignItems="center">
                                            <Grid item xs={1}>
                                                <RssFeedIcon
                                                    style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                                    Feeds registrados
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <Metric metric={{value: data.retrieveMetrics.feeds, title: 'feeds registrados en el sistema'}}/>
                                </ExpansionPanel>

                                <ExpansionPanel square expanded={expanded === 'panel4'}
                                                onChange={handleChange('panel4')}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}
                                                           aria-controls="panel1d-content"
                                                           id="panel1d-header">
                                        <Grid container spacing={3} direction="row"
                                              justify="center"
                                              alignItems="center">
                                            <Grid item xs={1}>
                                                <LoopIcon
                                                    style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                                    Actividades
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <Activities activities={data.retrieveMetrics.activities}/>
                                </ExpansionPanel>
                            </div>
                        );
                    }
                }}
            </Query>
        </div>
    );
}
