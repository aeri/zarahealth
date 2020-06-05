import React, {useState} from "react";
import {Box, CircularProgress, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import WarningIcon from '@material-ui/icons/Warning';
import List from "@material-ui/core/List";
import gql from "graphql-tag";
import ErrorMessageDash from "../common/ErrorMessageDash";
import {Query} from "@apollo/react-components";
import {DateTime} from "luxon";
import InfoIcon from '@material-ui/icons/Info';
import NewReleasesIcon from '@material-ui/icons/NewReleases';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    button: {
        height: 135,
        width: '100%',
        textTransform: 'none',
        backgroundColor: "white"
    },
}));

const GET_ALERTS = gql`
  query RetrieveAlerts($limit: Int!) {
    retrieveAlerts(limit: $limit) {
      title
      body
      date
      level
    }
  }
`;

function Alerts() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Query query={GET_ALERTS} variables={{
                limit: 5,
            }}>
                {({data, loading, error}) => {
                    if (loading || data === undefined || (data !== undefined && data.length === 0)) {
                        return (
                            <div style={{
                                position: "relative",
                                top: "15%",
                                left: "45%",
                                width: "100%",
                            }}>
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }

                    if (error) {
                        return <div style={{
                            position: "relative",
                            top: "15%",
                            left: "25%",
                            width: "100%",
                        }}>
                            <ErrorMessageDash message={'Avisos no disponibles'}/>
                        </div>

                    }

                    if (data) {
                        return (
                            <List>
                                <Grid container spacing={1}>
                                    {data.retrieveAlerts.map((alert) => {
                                        return (
                                            <Grid item xs={12}>
                                                <Box m={1}>
                                                    <Button variant="contained" size="large"
                                                            classes={{root: classes.button}}>
                                                        <Grid container spacing={0} direction="row"
                                                              justify="center"
                                                              alignItems="center">
                                                            <Grid item xs={2}>
                                                                {
                                                                    alert.level === 'NOTICE' ?
                                                                        <InfoIcon color="secondary"
                                                                                  className={classes.largeIcon}
                                                                                  style={{
                                                                                      fontSize: 60,
                                                                                      verticalAlign: "middle",
                                                                                  }}/>

                                                                        : alert.level === 'WARNING' ?
                                                                        <NewReleasesIcon color="secondary"
                                                                                         className={classes.largeIcon}
                                                                                         style={{
                                                                                             fontSize: 60,
                                                                                             verticalAlign: "middle",
                                                                                         }}/>

                                                                        : <WarningIcon color="secondary"
                                                                                       className={classes.largeIcon}
                                                                                       style={{
                                                                                           fontSize: 60,
                                                                                           verticalAlign: "middle",
                                                                                       }}/>
                                                                }

                                                            </Grid>
                                                            <Grid item xs={10}>
                                                                <Typography component="div">
                                                                    <Box fontWeight="fontWeightMedium" m={1}
                                                                         fontSize={20}
                                                                         color="#2f3542">
                                                                        {alert.title}
                                                                    </Box>
                                                                    <Box fontWeight="fontWeightRegular" m={1}
                                                                         color="#2f3542">
                                                                        {alert.body}
                                                                    </Box>
                                                                    <Box fontWeight="fontWeightRegular" m={1}
                                                                         color="#2f3542">
                                                                        {DateTime.fromMillis(alert.date * 1).toFormat(
                                                                            "dd/LL/yyyy HH:mm"
                                                                        )}

                                                                    </Box>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )
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

export default Alerts;
