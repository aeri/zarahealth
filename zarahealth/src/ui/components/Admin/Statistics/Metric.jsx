import React from "react";
import {Box, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import zaraHealthTheme from "../../../theme";


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
            width: "100%",

        },
    },

}));

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

export default function Metric({ metric }) {
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
                                <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                                    <Box fontWeight="fontWeightMedium" m={1} fontSize={30} color="white">
                                        {metric.value} {metric.title}
                                    </Box>
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </ExpansionPanelDetails>
        </div>
    );
}



