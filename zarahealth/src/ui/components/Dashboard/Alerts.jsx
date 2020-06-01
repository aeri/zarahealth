import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import WarningIcon from '@material-ui/icons/Warning';
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    button: {
        height: 100,
        width: '100%',
        textTransform: 'none',
        backgroundColor: "white"
    },
}));

function Alerts() {
    const classes = useStyles();
    const fakeAlerts = [
        {
            message: "Alta concentración de NO2",
            station: "Estación 23"
        },
        {
            message: "Alta concentración de NO2",
            station: "Estación 23"
        }
    ];
    const [alerts, setAlerts] = useState(fakeAlerts);

    return (
        <div className={classes.root}>
            <List>
                {alerts.map((alert) => {
                    return (
                        <Box m={1}>
                            <Button variant="contained" size="large"
                                    classes={{root: classes.button}}>
                                <Grid container spacing={0} direction="row"
                                      justify="center"
                                      alignItems="center">
                                    <Grid item xs={2}>
                                        <WarningIcon color="secondary" className={classes.largeIcon}
                                                     style={{fontSize: 60, verticalAlign: "middle",}}/>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightMedium" m={1} fontSize={20} color="#2f3542">
                                                {alert.message}
                                            </Box>
                                            <Box fontWeight="fontWeightRegular" m={1} color="#2f3542">
                                                {alert.station}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Button>
                        </Box>
                    )
                })}
            </List>
        </div>
    );
}

export default Alerts;
