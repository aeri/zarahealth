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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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
        width: 600,
        overflow: 'auto',
    },
    slider: {
        paddingBottom: 20,
    },
    input: {
        width: 200,
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

const GET_CURRENT_USER_AND_STATIONS = gql`
 query currentUserStations {
    currentUser @client {
      username
    }
    retrieveAllPollenMeasures {
      id
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
      pollenThresholds{
        id
        value
      }
    }
  }
`;

const UPDATE_POLLEN = gql`
  mutation updateUserPollenThreshold(
    $idPollenMeasure: String!,
    $pollenValue: String!
  ) {
    updateUserPollenThreshold(
      idPollenMeasure: $idPollenMeasure,
      pollenValue: $pollenValue
    ) {
      username
    }
  }
`;


function PollenAlertThresholds() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_CURRENT_USER_AND_STATIONS);
    const [pollenMeasures, setPollenMeasures] = React.useState([]);
    const [pollenThresholds, setPollenThresholds] = React.useState({});
    const [loaded, setLoaded] = React.useState(false);
    const [username, setUsername] = React.useState('');

    useEffect(() => {
        if ((data !== undefined && data.currentUser !== null && data.retrieveAllPollenMeasures !== null)) {
            setPollenMeasures(data.retrieveAllPollenMeasures)
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
                        if (!loaded && data.retrieveUser.pollenThresholds !== undefined && data.retrieveUser.pollenThresholds !== null) {
                            var pollenThresholdstemp = {}
                            for (const threshold of data.retrieveUser.pollenThresholds) {
                                pollenThresholdstemp[threshold.id] = threshold.value;
                            }
                            setPollenThresholds(pollenThresholdstemp)
                            setLoaded(true)
                        }

                        return (
                            <Mutation mutation={UPDATE_POLLEN}>
                                {(updateUserPollenThreshold, {data, loading}) => {
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
                                                                                    <Grid container direction="column"
                                                                                          justify="flex-start"
                                                                                          style={{
                                                                                              paddingLeft: 20,
                                                                                              paddingTop: 10,
                                                                                              paddingBottom: 10
                                                                                          }}>
                                                                                        <Grid item xs={12}>
                                                                                            <Typography color="primary">
                                                                                                <Box
                                                                                                    fontWeight="fontWeightRegular"
                                                                                                    m={1} fontSize={23}>
                                                                                                    Datos actualizados
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

                                        Object.keys(pollenThresholds).forEach(function (key) {
                                            console.log({
                                                idPollenMeasure: key,
                                                pollenValue: String(pollenThresholds[key])
                                            })
                                            updateUserPollenThreshold({
                                                variables: {
                                                    idPollenMeasure: key,
                                                    pollenValue: String(pollenThresholds[key])
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
                                                                        <Grid container
                                                                              style={{paddingLeft: 30}}>
                                                                            {pollenMeasures.map((measure) => {
                                                                                return (
                                                                                    <Grid item xs={12} md={6}>
                                                                                        <div className={classes.slider}>
                                                                                            <Typography
                                                                                                id="input-slider"
                                                                                                gutterBottom>
                                                                                                {measure.id}
                                                                                            </Typography>
                                                                                            <Grid container spacing={2}
                                                                                                  alignItems="center">
                                                                                                <Grid item xs={12}>
                                                                                                    <Select
                                                                                                        className={classes.input}
                                                                                                        id="demo-simple-select"
                                                                                                        value={pollenThresholds[measure.id] || ''}
                                                                                                        required
                                                                                                        onChange={(event) => {
                                                                                                            var pollenThresholdstemp = {...pollenThresholds}
                                                                                                            pollenThresholdstemp[measure.id] = event.target.value
                                                                                                            setPollenThresholds(pollenThresholdstemp)
                                                                                                        }}
                                                                                                    >
                                                                                                        <MenuItem
                                                                                                            value={"BAJO"}>Bajo</MenuItem>
                                                                                                        <MenuItem
                                                                                                            value={"MODERADO"}>Moderado</MenuItem>
                                                                                                        <MenuItem
                                                                                                            value={"ALTO"}>Alto</MenuItem>
                                                                                                    </Select>

                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </div>
                                                                                    </Grid>

                                                                                )
                                                                            })}
                                                                        </Grid>
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
            </Query>
        </div>
    );
}

export default PollenAlertThresholds;

