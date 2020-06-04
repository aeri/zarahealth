import React from "react";

import {makeStyles} from "@material-ui/core/styles";
import DataSummary from "../components/Dashboard/DataSummary";
import PersonalAlerts from "../components/Dashboard/PersonalAlerts";
import Alerts from "../components/Dashboard/Alerts";
import {Box, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
}));

function DashboardView() {
    const classes = useStyles();
    return (
        <Box m={1}>
            <div className={classes.root}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                            <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                                Hoy
                            </Box>
                        </Typography>
                        <DataSummary/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography color="white" style={{paddingTop: 20, paddingLeft: 0}}>
                            <Box fontWeight="fontWeightMedium" m={1} fontSize={27} color="white">
                                Alertas personales
                            </Box>
                        </Typography>
                    <PersonalAlerts/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography color="white" style={{paddingTop: 20, paddingLeft: 0}}>
                            <Box fontWeight="fontWeightMedium" m={1} fontSize={27} color="white">
                                Avisos
                            </Box>
                        </Typography>
                        <Alerts/>
                    </Grid>
                </Grid>
            </div>
        </Box>
    );
}

export default DashboardView;
