import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  withStyles,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { useQuery } from "@apollo/react-hooks";
import { ApolloConsumer, Mutation, Query } from "@apollo/react-components";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import zaraHealthTheme from "../../../theme";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import gql from "graphql-tag";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
      width: "100%",
    },
  },
  list: {
    width: 200,
    overflow: "auto",
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
    paddingRight: 20,
  },
}))(MuiExpansionPanelActions);

const GET_CURRENT_USER_AND_STATIONS = gql`
  query currentUserStations {
    currentUser @client {
      username
    }
    retrieveAllAirStations {
      id
      title
    }
  }
`;

const GET_INFO_USER = gql`
  query retrieveUser($username: String!) {
    retrieveUser(username: $username) {
      preferredAirStation {
        id
      }
    }
  }
`;

const UPDATE_AIR_STATION = gql`
  mutation updateUserAirStation($idAirStation: Int!) {
    updateUserAirStation(idAirStation: $idAirStation) {
      username
    }
  }
`;

function AirFavStation() {
  const classes = useStyles();
  const { loading, data, error } = useQuery(GET_CURRENT_USER_AND_STATIONS);
  const [preferredAirStation, setPreferredAirStation] = React.useState(-1);
  const [stations, setStations] = React.useState([]);
  const [username, setUsername] = React.useState("");

  useEffect(() => {
    if (
      data !== undefined &&
      data.currentUser !== null &&
      data.retrieveAllAirStations !== null
    ) {
      setUsername(data.currentUser.username);
      setStations(data.retrieveAllAirStations);
    }
  }, [data, error, loading]);

<<<<<<< HEAD
  return (
    <div>
      <Query
        query={GET_INFO_USER}
        variables={{
          username: username,
        }}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "45%",
                  width: "100%",
                }}
              >
                <CircularProgress color="secondary" />
              </div>
            );
          }
          if (error) {
            return (
              <h2 style={{ color: "white" }}>Error: {JSON.stringify(error)}</h2>
            );
          }
          if (data !== undefined && data.retrieveUser !== null) {
            if (preferredAirStation === -1) {
              if (data.retrieveUser.preferredAirStation !== null) {
                setPreferredAirStation(
                  data.retrieveUser.preferredAirStation.id
                );
              }
            }
=======
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
                        if (preferredAirStation === -1 && data.retrieveUser.preferredAirStation !== null && data.retrieveUser.preferredAirStation !== undefined) {
                            if (data.retrieveUser.preferredAirStation !== null) {
                                setPreferredAirStation(data.retrieveUser.preferredAirStation.id)
                            }
                        }
>>>>>>> a8618aeb3583941ed1f092a7815d32eab3795a3b

            return (
              <Mutation mutation={UPDATE_AIR_STATION}>
                {(updateUserAirStation, { data, loading }) => {
                  if (loading) {
                    return (
                      <div
                        style={{
                          position: "relative",
                          top: "15%",
                          left: "45%",
                          width: "100%",
                        }}
                      >
                        <CircularProgress color="secondary" />
                      </div>
                    );
                  }

                  if (data !== undefined) {
                    return (
                      <ApolloConsumer>
                        {() => {
                          return (
                            <div>
                              <ExpansionPanelDetails>
                                <Grid
                                  container
                                  spacing={1}
                                  direction="column"
                                  justify="center"
                                  alignItems="center"
                                >
                                  <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                  >
                                    <Grid item xs={12}>
                                      <div className={classes.paper}>
                                        <Paper elevation={3}>
                                          <Grid
                                            container
                                            direction="column"
                                            justify="flex-start"
                                            style={{
                                              paddingLeft: 20,
                                              paddingTop: 10,
                                              paddingBottom: 10,
                                            }}
                                          >
                                            <Grid item xs={12}>
                                              <Typography color="primary">
                                                <Box
                                                  fontWeight="fontWeightRegular"
                                                  m={1}
                                                  fontSize={23}
                                                >
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
                                <Button
                                  size="medium"
                                  color="secondary"
                                  onClick={() => window.location.reload()}
                                >
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
                    updateUserAirStation({
                      variables: {
                        idAirStation: preferredAirStation,
                      },
                    });
                  };

                  return (
                    <form noValidate onSubmit={handleSubmit}>
                      <ExpansionPanelDetails>
                        <Grid
                          container
                          spacing={1}
                          direction="column"
                          justify="center"
                          alignItems="center"
                        >
                          <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item xs={12}>
                              <div className={classes.paper}>
                                <Paper elevation={3}>
                                  <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    style={{ paddingLeft: 20, paddingTop: 10 }}
                                  >
                                    <Grid item xs={12}>
                                      <Typography color="primary">
                                        <Box
                                          fontWeight="fontWeightRegular"
                                          m={1}
                                          fontSize={27}
                                        >
                                          Estación preferida
                                        </Box>
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    style={{ paddingLeft: 20 }}
                                  >
                                    <Grid item xs={12}>
                                      <List
                                        dense
                                        component="div"
                                        style={{ width: 300 }}
                                        role="list"
                                        className={classes.list}
                                      >
                                        {stations.map((station) => {
                                          return (
                                            <ListItem
                                              role="listitem"
                                              style={{ width: 300 }}
                                            >
                                              <ListItemIcon>
                                                <Checkbox
                                                  checked={
                                                    station.id ===
                                                    preferredAirStation
                                                  }
                                                  onChange={() => {
                                                    setPreferredAirStation(
                                                      station.id
                                                    );
                                                  }}
                                                  tabIndex={-1}
                                                  disableRipple
                                                />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={station.title}
                                              />
                                            </ListItem>
                                          );
                                        })}
                                        <ListItem />
                                      </List>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ExpansionPanelDetails>
                      <ExpansionPanelActions>
                        <Button
                          size="medium"
                          style={{ color: "white" }}
                          onClick={() => window.location.reload()}
                        >
                          Cancelar
                        </Button>
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
        }}
      </Query>
    </div>
  );
}

export default AirFavStation;
