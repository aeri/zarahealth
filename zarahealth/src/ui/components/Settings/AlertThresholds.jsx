import React from "react";
import {Box, MuiThemeProvider, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import WarningIcon from '@material-ui/icons/Warning';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
            width: "100%",

        },
    },
    list: {
        width: 400,
        overflow: 'auto',
    },
    slider: {
        width: 250,
    },
    input: {
        width: 42,
    },
}));

function AlertThresholds() {
    const classes = useStyles();
    const handleSliderChange = (event, newValue) => {
    };

    const handleInputChange = (event) => {
    };

    const handleBlur = () => {
    };

    const fakeThresholds = [
        {
            element: "NO2",
            threshold: 10
        },
        {
            element: "NO2",
            threshold: 20
        },
        {
            element: "NO2",
            threshold: 30
        },
    ];
    const [thresholds, setThresholds] = React.useState(fakeThresholds);
    return (
        <div className={classes.paper}>
            <Paper elevation={3}>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 20, paddingTop: 10}}>
                    <Grid item xs={12}>
                        <Typography color="primary">
                            <Box fontWeight="fontWeightRegular" m={1} fontSize={27}>
                                Umbrales de alerta
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                <List dense component="div" role="list" className={classes.list}>
                    {thresholds.map((threshold) => {
                        return (
                        <Grid container direction="column" justify="flex-start" style={{paddingLeft: 30}}>
                            <Grid item xs={12}>
                                <div className={classes.slider}>
                                    <Typography id="input-slider" gutterBottom>
                                        {threshold.element}
                                    </Typography>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Slider
                                                value={threshold.threshold}
                                                onChange={handleSliderChange}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Input
                                                className={classes.input}
                                                value={threshold.threshold}
                                                margin="dense"
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    step: 10,
                                                    min: 0,
                                                    max: 100,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    )
                    })}
                </List>
            </Paper>
        </div>
    );
}

export default AlertThresholds;


