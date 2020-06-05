import React from "react";
import {Box, Typography, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import zaraHealthTheme from "../../theme/index";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StorageIcon from '@material-ui/icons/Storage';
import AdminData from "./Settings/AdminData";
import AdminImage from "./Settings/AdminImage";
import DataSources from "./Settings/DataSources";


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


function AdminSettings() {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div style={styles}>
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
                <AdminData/>
                <AdminImage/>
            </ExpansionPanel>

            <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1d-content"
                                       id="panel1d-header">
                    <Grid container spacing={3} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={1}>
                            <StorageIcon
                                style={{fontSize: 40, verticalAlign: "middle",}} color="primary"/>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography style={{fontSize: 30, paddingLeft: 25}} color="primary">
                                Fuentes de datos
                            </Typography>
                        </Grid>
                    </Grid>
                </ExpansionPanelSummary>
                <DataSources/>
            </ExpansionPanel>



        </div>
    );
}

export default AdminSettings;
