import React from "react";
import {
    List,
    Box,
    Grid, withStyles,
} from "@material-ui/core";
import Activity from "./Activity";
import {makeStyles} from "@material-ui/core/styles";
import zaraHealthTheme from "../../../theme";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    fab: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed",
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
        fill: "white",
    },
}));

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

function Activities({activities}) {
    const classes = useStyles();
    return (
        <div>
            <ExpansionPanelDetails>
                <Grid container spacing={1} direction="column"
                      justify="center"
                      alignItems="center">
                    <Grid container spacing={1} direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={12}>
                            <div className={classes.paper}>

                                <List>
                                    {activities.map((activity, index) => {
                                        return (
                                            <Box m={1}>
                                                <Activity activity={activity}/>
                                            </Box>
                                        );
                                    })}
                                </List>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </div>


    );
}

export default Activities;
