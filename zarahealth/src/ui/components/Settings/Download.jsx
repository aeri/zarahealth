import React from "react";
import {Box, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GetAppIcon from '@material-ui/icons/GetApp';
import FormControl from "@material-ui/core/FormControl";


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

function Download() {
    const classes = useStyles();

    const [state, setState] = React.useState({
        checkedA: true,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <div className={classes.paper}>
            <Paper elevation={3}>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 20, paddingTop: 10}}>
                    <Grid item xs={12}>
                        <Typography color="primary">
                            <Box fontWeight="fontWeightRegular" m={1} fontSize={27}>
                                Descarga
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 40}}>
                    <Grid item xs={12}>
                        <div>
                            <Grid container spacing={2} alignItems="center" style={{paddingBottom: 15}}>
                                <Grid item >
                                    <FormGroup column>
                                        <FormControlLabel
                                            control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                            label="Habilitar descarga CSV"
                                        />
                                        <FormControl margin={'dense'}>
                                            <Grid container spacing={0} direction="row"
                                                  justify="center"
                                                  alignItems="center">
                                                <Grid item xs={1}>
                                                    <GetAppIcon style={{ fontSize: 30, verticalAlign: "middle",}}/>
                                                </Grid>
                                                <Grid item xs={11} justify="center"
                                                      alignItems="center">
                                                    <Typography style={{fontSize: 16, paddingLeft: 25}} color="primary">
                                                        Descargar datos de cuenta
                                                    </Typography>
                                                </Grid>
                                            </Grid>


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

export default Download;


