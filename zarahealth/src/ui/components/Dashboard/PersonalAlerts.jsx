import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import WarningIcon from "@material-ui/icons/Warning";
import List from "@material-ui/core/List";
import gql from "graphql-tag";
import { Query } from "@apollo/react-components";
import { getAlerts } from "../../../core/services/personalAlertService";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  button: {
    height: 100,
    width: "100%",
    textTransform: "none",
    backgroundColor: "white",
  },
}));

// preferredWaterStation {
//   title
//   results {
//     result
//   }
// }

const GET_DATA = gql`
  {
    retrieveUser {
      preferredAirStation {
        id
        title
        thresholds {
          contaminant
          value
        }
      }
      pollenThresholds {
        id
        value
      }
    }
    retrieveAllPollenMeasures {
      id
      observation {
        value
      }
    }
    retrieveAllAirStations {
      id
      records {
        contaminant
        value
        date
      }
    }
  }
`;

function PersonalAlerts() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Query query={GET_DATA}>
        {({ data, loading , error}) => {
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
          
          if(error) {
            return null;
          }

          if (data) {
            let alerts = getAlerts(
              data.retrieveUser.preferredWaterStation,
              data.retrieveAllAirStations,
              data.retrieveUser.preferredAirStation,
              data.retrieveAllPollenMeasures,
              data.retrieveUser.pollenThresholds
            );
            if (alerts.length === 0) {
              alerts.push({
                title: 'No se ha detectado ninguna alerta',
                location: 'Zaragoza'
              })
            }
            return (
              <List>
                <Grid container spacing={1}>
                  {alerts.map((alert) => {
                    return (
                      <Grid item xs={12}>
                        <Box m={1}>
                          <Button
                            variant="contained"
                            size="large"
                            classes={{ root: classes.button }}
                          >
                            <Grid
                              container
                              spacing={0}
                              direction="row"
                              justify="center"
                              alignItems="center"
                            >
                              <Grid item xs={2}>
                                <WarningIcon
                                  color="secondary"
                                  className={classes.largeIcon}
                                  style={{
                                    fontSize: 60,
                                    verticalAlign: "middle",
                                  }}
                                />
                              </Grid>
                              <Grid item xs={10}>
                                <Typography component="div">
                                  <Box
                                    fontWeight="fontWeightMedium"
                                    m={1}
                                    fontSize={20}
                                    color="#2f3542"
                                  >
                                    {alert.title}
                                  </Box>
                                  <Box
                                    fontWeight="fontWeightRegular"
                                    m={1}
                                    color="#2f3542"
                                  >
                                    {alert.location}
                                  </Box>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Button>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </List>
            );
          }
        }}
      </Query>
    </div>
  );
}

export default PersonalAlerts;
