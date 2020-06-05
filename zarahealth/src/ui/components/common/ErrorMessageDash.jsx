import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import WarningIcon from '@material-ui/icons/Warning';
import List from "@material-ui/core/List";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
}));

function ErrorMessageDash({ message })  {
    const classes = useStyles();

    return (
        <Box m={1}>
            <div className={classes.root}>
                <Box m={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <div style={{
                                position: 'relative', left: '50%', top: '40%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                <Grid container spacing={0} direction="row"
                                      justify="center"
                                      alignItems="center">
                                    <Grid item xs={12}>
                                        <FavoriteBorderIcon
                                            style={{fontSize: 180, verticalAlign: "middle"}} color="secondary"/>
                                        <Typography component="div">
                                            <Box fontWeight="fontWeightMedium" m={1} fontSize={20} color="white">
                                                {message}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                    </Grid>
                </Box>
            </div>
        </Box>

    );
}

export default ErrorMessageDash;
