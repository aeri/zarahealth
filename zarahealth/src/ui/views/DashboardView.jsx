import React from "react";

import {makeStyles} from "@material-ui/core/styles";
import DataSummary from "../components/Dashboard/DataSummary";
import Alerts from "../components/Dashboard/Alerts";
import {Box, Typography} from "@material-ui/core";

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
            <Typography color="white" style={{paddingTop: 0, paddingLeft:0}}>
                <Box fontWeight="fontWeightMedium" m={1}  fontSize={45} color="white">
                    Hoy
                </Box>
            </Typography>
            <DataSummary/>
            <Typography color="white" style={{ paddingTop: 20, paddingLeft:0}}>
                <Box fontWeight="fontWeightMedium" m={1}  fontSize={27} color="white">
                    Alertas
                </Box>
            </Typography>
            <Alerts/>
        </div>
        </Box>
    );
}

export default DashboardView;
