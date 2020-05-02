import React from "react";
import {Box, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from '@material-ui/core/FormControl';

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

function UserData() {
    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Paper elevation={3}>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 20, paddingTop: 10}}>
                    <Grid item xs={12}>
                        <Typography color="primary">
                            <Box fontWeight="fontWeightRegular" m={1} fontSize={27}>
                                Datos personales
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 40}}>
                    <Grid item xs={12}>
                        <div>
                            <Grid container alignItems="center" style={{paddingBottom: 45}}>
                                <Grid item >
                                    <FormGroup column>
                                        <FormControl margin={'dense'}>
                                            <TextField id="standard-basic" label="Nombre" />
                                        </FormControl>
                                        <FormControl margin={'dense'}>
                                            <TextField id="standard-basic" label="Email" />
                                        </FormControl>
                                        <FormControl margin={'dense'}>
                                            <TextField id="standard-basic" label="Contraseña nueva" />
                                        </FormControl>
                                        <FormControl margin={'dense'}>
                                            <TextField id="standard-basic" label="Repetir contraseña" />
                                        </FormControl>
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default UserData;


