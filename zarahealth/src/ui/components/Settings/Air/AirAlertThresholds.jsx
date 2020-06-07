import React, {useEffect} from "react";
import {Box, CircularProgress, MuiThemeProvider, Typography, withStyles} from "@material-ui/core";
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
import {useQuery} from "@apollo/react-hooks";
import {ApolloConsumer, Mutation, Query} from "@apollo/react-components";
import Button from "@material-ui/core/Button";
import zaraHealthTheme from "../../../theme";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import gql from "graphql-tag";
import client from "../../../../core/apollo/apolloClient";

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

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const ExpansionPanelActions = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(0),
        paddingBottom: 15,
        paddingRight: 20
    },
}))(MuiExpansionPanelActions);

const GET_CURRENT_USER = gql`
 query currentUserStations {
    currentUser @client {
      username
    }
    
  }
`;
const GET_INFO_USER = gql`
 query retrieveUser(
    $username: String!,
  ) {
    retrieveUser(
      username: $username,
    ) {
      preferredAirStation{
        id
        thresholds{
            contaminant
            value
        }
      }
    }
  }
`;

const UPDATE_AIR = gql`
  mutation updateUserAirThreshold(
    $idAirStation: Int!,
    $airContaminant: Contaminant!,
    $airValue: Float!
  ) {
    updateUserAirThreshold(
      idAirStation: $idAirStation,
      airContaminant: $airContaminant,
      airValue: $airValue
    ) {
      username
    }
  }
`;


function AirAlertThresholds() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_CURRENT_USER);
    const [airThresholds, setAirThresholds] = React.useState({});
    const [airFavStation, setAirFavStation] = React.useState();
    const [username, setUsername] = React.useState('');

    const contaminants = ["NOx", "SO2", "NO2", "CO", "O3", "PM10", "PM2_5", "SH2"];

    useEffect(() => {
        if ((data !== undefined && data.currentUser !== null)) {
            setUsername(data.currentUser.username)
        }

    }, [data, error, loading]);

    return (
        <div>
            <Query query={GET_INFO_USER} variables={{
                username: username,
            }}>
                {({data, loading, error}) => {
                    if (loading) {
                        return (
                            <div style={{
                                position: "absolute",
                                top: "15%",
                                left: "45%",
                                width: "100%",
                            }}>
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }
                    if (error) {
                        return <h2 style={{color: "white"}}>Error: {JSON.stringify(error)}</h2>;
                    }
                    if ((data !== undefined && data.retrieveUser !== null)) {
                        console.log('LLEGA')
                        if (airFavStation === undefined && data.retrieveUser.preferredAirStation !== null && data.retrieveUser.preferredAirStation !== undefined) {
                            setAirFavStation(data.retrieveUser.preferredAirStation.id)
                            var airThresholdstemp = {}
                            for (const threshold of data.retrieveUser.preferredAirStation.thresholds) {
                                airThresholdstemp[threshold.contaminant] = threshold.value;
                            }
                            setAirThresholds(airThresholdstemp)
                        }

                        if (airFavStation === undefined) {
                            return (
                                <ExpansionPanelDetails>
                                    <Grid container spacing={1} direction="column"
                                          justify="center"
                                          alignItems="center">
                                        <Grid container spacing={1} direction="row"
                                              justify="center"
                                              alignItems="center">
                                            <Grid item xs={12}>
                                                <div className={classes.paper}>
                                                    <Paper elevation={3}>
                                                        <Grid container direction="column"
                                                              justify="flex-start"
                                                              style={{paddingLeft: 20, paddingTop: 10}}>
                                                            <Grid item xs={12}>
                                                                <Typography color="primary">
                                                                    <Box fontWeight="fontWeightRegular"
                                                                         m={1} fontSize={27}>
                                                                        Umbrales de alerta
                                                                    </Box>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container direction="column"
                                                              justify="flex-start"
                                                              style={{paddingLeft: 20, paddingBottom: 20}}>
                                                            <Grid item xs={12}>
                                                                <Typography color="primary">
                                                                    <Box fontWeight="fontWeightRegular"
                                                                         m={1} fontSize={20}>
                                                                        Debes seleccionar antes tu estación preferida
                                                                    </Box>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            );

                        } else {
                            return (
                                <Mutation mutation={UPDATE_AIR}>
                                    {(updateUserAirThreshold, {data, loading}) => {
                                        if (loading) {
                                            return <div style={{
                                                position: "relative",
                                                top: "15%",
                                                left: "45%",
                                                width: "100%",
                                            }}>
                                                <CircularProgress color="secondary"/>
                                            </div>
                                        }

                                        if (data !== undefined) {
                                            return (
                                                <ApolloConsumer>
                                                    {() => {
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
                                                                                    <Paper elevation={3}>
                                                                                        <Grid container
                                                                                              direction="column"
                                                                                              justify="flex-start"
                                                                                              style={{
                                                                                                  paddingLeft: 20,
                                                                                                  paddingTop: 10,
                                                                                                  paddingBottom: 10
                                                                                              }}>
                                                                                            <Grid item xs={12}>
                                                                                                <Typography
                                                                                                    color="primary">
                                                                                                    <Box
                                                                                                        fontWeight="fontWeightRegular"
                                                                                                        m={1}
                                                                                                        fontSize={23}>
                                                                                                        Datos
                                                                                                        actualizados
                                                                                                        correctamente
                                                                                                    </Box>
                                                                                                </Typography>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Paper>
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </ExpansionPanelDetails>
                                                                <ExpansionPanelActions>
                                                                    <Button size="medium" color="secondary"
                                                                            onClick={() => window.location.reload()}>
                                                                        Aceptar
                                                                    </Button>
                                                                </ExpansionPanelActions>
                                                            </div>
                                                        );
                                                    }}
                                                </ApolloConsumer>
                                            );
                                        }

                                        const handleSubmit = (e) => {
                                            Object.keys(airThresholds).forEach(function (key) {
                                                updateUserAirThreshold({
                                                    variables: {
                                                        idAirStation: airFavStation,
                                                        airContaminant: key,
                                                        airValue: airThresholds[key]
                                                    }
                                                });
                                            });
                                        }


                                        return (
                                            <form
                                                noValidate
                                                onSubmit={handleSubmit}
                                            >
                                                <ExpansionPanelDetails>
                                                    <Grid container spacing={1} direction="column"
                                                          justify="center"
                                                          alignItems="center">
                                                        <Grid container spacing={1} direction="row"
                                                              justify="center"
                                                              alignItems="center">
                                                            <Grid item xs={12}>
                                                                <div className={classes.paper}>
                                                                    <Paper elevation={3}>
                                                                        <Grid container direction="column"
                                                                              justify="flex-start"
                                                                              style={{paddingLeft: 20, paddingTop: 10}}>
                                                                            <Grid item xs={12}>
                                                                                <Typography color="primary">
                                                                                    <Box fontWeight="fontWeightRegular"
                                                                                         m={1} fontSize={27}>
                                                                                        Umbrales de alerta
                                                                                    </Box>
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <List dense component="div" role="list"
                                                                              className={classes.list}>
                                                                            {contaminants.map((measure) => {
                                                                                return (
                                                                                    <Grid container direction="column"
                                                                                          justify="flex-start"
                                                                                          style={{paddingLeft: 30}}>
                                                                                        <Grid item xs={12}>
                                                                                            <div
                                                                                                className={classes.slider}>
                                                                                                <Typography
                                                                                                    id="input-slider"
                                                                                                    gutterBottom>
                                                                                                    {measure}
                                                                                                </Typography>
                                                                                                <Grid container
                                                                                                      spacing={2}
                                                                                                      alignItems="center">
                                                                                                    <Grid item xs>
                                                                                                        <Slider
                                                                                                            value={airThresholds[measure] || ''}
                                                                                                            onChange={(event, newValue) => {
                                                                                                                var airThresholdstemp = {...airThresholds}
                                                                                                                airThresholdstemp[measure] = parseFloat(newValue)
                                                                                                                setAirThresholds(airThresholdstemp)
                                                                                                            }}
                                                                                                        />
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                        <Input
                                                                                                            className={classes.input}
                                                                                                            value={airThresholds[measure] || ''}
                                                                                                            margin="dense"
                                                                                                            onChange={(event) => {
                                                                                                                var airThresholdstemp = {...airThresholds}
                                                                                                                airThresholdstemp[measure] = parseFloat(event.target.value)
                                                                                                                setAirThresholds(airThresholdstemp)
                                                                                                            }}
                                                                                                            inputProps={{
                                                                                                                step: 1,
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
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </ExpansionPanelDetails>
                                                <ExpansionPanelActions>
                                                    <Button size="medium" style={{color: "white"}}
                                                            onClick={() => window.location.reload()}>Cancelar</Button>
                                                    <Button size="medium" color="secondary" type="submit">
                                                        Guardar
                                                    </Button>
                                                </ExpansionPanelActions>
                                            </form>
                                        );
                                    }}
                                </Mutation>
                            );
                        }
                    }
                }
                }
            </Query>
        </div>
    );
}

export default AirAlertThresholds;