import React from "react";
import {Box, Typography, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import zaraHealthTheme from "../theme/index";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import OpacityIcon from '@material-ui/icons/Opacity';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavStation from "../components/Settings/FavSatation";
import AlertThresholds from "../components/Settings/AlertThresholds";
import UserData from "../components/Settings/UserData";
import Download from "../components/Settings/Download";

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

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const ExpansionPanelActions = withStyles((theme) => ({
  root: {
    backgroundColor: zaraHealthTheme.palette.primary.main,
    padding: theme.spacing(1),
    paddingBottom: 15,
    paddingRight: 20
  },
}))(MuiExpansionPanelActions);


function SettingsView() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div>
            <Box m={1}>
                <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                    <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                        Ajustes
                    </Box>
                </Typography>
            </Box>

            <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1d-content"
                                       id="panel1d-header">
                    <Grid container spacing={3} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={1}>
                            <LocalFloristIcon
                                style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                Polen
                            </Typography>
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
                              <FavStation/>
                            </Grid>
                        </Grid>
                      <Grid container spacing={1} direction="row"
                            justify="center"
                            alignItems="center">
                        <Grid item xs={12}>
                          <AlertThresholds/>
                        </Grid>
                      </Grid>
                    </Grid>
                </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="medium" style={{color: "white"}}>Cancelar</Button>
                <Button size="medium" color="secondary">
                  Guardar
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>

            <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1d-content"
                                       id="panel1d-header">
                    <Grid container spacing={3} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={1}>
                            <OpacityIcon
                                style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                Agua
                            </Typography>
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
                      <FavStation/>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row"
                        justify="center"
                        alignItems="center">
                    <Grid item xs={12}>
                      <AlertThresholds/>
                    </Grid>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="medium" style={{color: "white"}}>Cancelar</Button>
                <Button size="medium" color="secondary">
                  Guardar
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>

            <ExpansionPanel square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1d-content"
                                       id="panel1d-header">
                    <Grid container spacing={3} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={1}>
                            <CloudQueueIcon
                                style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                Aire
                            </Typography>
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
                      <FavStation/>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row"
                        justify="center"
                        alignItems="center">
                    <Grid item xs={12}>
                      <AlertThresholds/>
                    </Grid>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="medium" style={{color: "white"}}>Cancelar</Button>
                <Button size="medium" color="secondary">
                  Guardar
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>

            <ExpansionPanel square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1d-content"
                                       id="panel1d-header">
                    <Grid container spacing={3} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={1}>
                            <AccountCircleIcon
                                style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                Mi cuenta
                            </Typography>
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
                      <UserData/>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} direction="row"
                        justify="center"
                        alignItems="center">
                    <Grid item xs={12}>
                      <Download/>
                    </Grid>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="medium" style={{color: "white"}}>Cancelar</Button>
                <Button size="medium" color="secondary">
                  Guardar
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
        </div>
    );
}

export default SettingsView;
