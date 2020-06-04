import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import {makeStyles} from "@material-ui/core/styles";
import OpacityIcon from '@material-ui/icons/Opacity';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import history from "../../../core/misc/history";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    button: {
        height: 150,
        width: '100%',
        textTransform: 'none',
    },
}));

function DataSummary() {
    const classes = useStyles();
    const statusColors = ["white", "#33d9b2", "#ffda79", "#ff6c65"];
    const fakePolen = {
        message: "Aceptable",
        status: 1
    };
    const fakeAgua = {
        message: "Potable",
        status: 2
    };
    const fakeAire = {
        message: "CO2 elevado",
        status: 3
    };
    const [polen, setPolen] = useState(fakePolen);
    const [agua, setAgua] = useState(fakeAgua);
    const [aire, setAire] = useState(fakeAire);

    return (
        <div className={classes.root}>
            <Box m={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={4}>
                        <Button variant="contained" size="large"
                                classes={{root: classes.button}} style={{backgroundColor: statusColors[polen.status]}}
                                onClick={() => history.replace("/pollen/info")}>
                            <Grid container spacing={0} direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Grid item xs={4}>
                                    <LocalFloristIcon
                                        style={{fontSize: 100, verticalAlign: "middle"}} color="primary"/>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{fontSize: 50}} color="primary">
                                        Polen
                                    </Typography>
                                    <Typography style={{fontSize: 20}} color="primary">
                                        {polen.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Button variant="contained" size="large"
                                classes={{root: classes.button}} style={{backgroundColor: statusColors[agua.status]}}
                                onClick={() => history.replace("/water/info")}>
                            <Grid container spacing={0} direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Grid item xs={4}>
                                    <OpacityIcon
                                        style={{fontSize: 100, verticalAlign: "middle"}} color="primary"/>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{fontSize: 50}} color="primary">
                                        Agua
                                    </Typography>
                                    <Typography style={{fontSize: 20}} color="primary">
                                        {agua.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Button variant="contained" size="large"
                                classes={{root: classes.button}} style={{backgroundColor: statusColors[aire.status]}}
                                onClick={() => history.replace("/air/info")}>
                            <Grid container spacing={0} direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Grid item xs={4}>
                                    <CloudQueueIcon
                                        style={{fontSize: 100, verticalAlign: "middle"}} color="primary"/>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography style={{fontSize: 50}} color="primary">
                                        Aire
                                    </Typography>
                                    <Typography style={{fontSize: 20}} color="primary">
                                        {aire.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                </Grid>

            </Box>


        </div>
    );
}

export default DataSummary;
