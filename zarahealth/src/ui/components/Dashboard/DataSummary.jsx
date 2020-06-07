import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LocalFloristIcon from "@material-ui/icons/LocalFlorist";
import {makeStyles} from "@material-ui/core/styles";
import OpacityIcon from "@material-ui/icons/Opacity";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";
import history from "../../../core/misc/history";
import gql from "graphql-tag";
import {Query} from "@apollo/react-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorMessage from "../common/ErrorMessage";
import {getSummary} from "../../../core/services/summary";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
    button: {
        height: 150,
        width: "100%",
        textTransform: "none",
    },
}));

const GET_DATA = gql`
  {
    retrieveAllWaterStations {
      title
      results {
        creationDate
        result
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

function DataSummary() {
    const classes = useStyles();
    const statusColors = ["white", "#33d9b2", "#ffda79", "#ff6c65"];
    const fakePolen = {
        message: "Aceptable",
        status: 1,
    };
    const fakeAgua = {
        message: "Potable",
        status: 2,
    };
    const fakeAire = {
        message: "CO2 elevado",
        status: 3,
    };
    const [polen, setPolen] = useState(fakePolen);
    const [agua, setAgua] = useState(fakeAgua);
    const [aire, setAire] = useState(fakeAire);


    return (
        <div className={classes.root}>
            <Query query={GET_DATA}>
                {({data, loading, error}) => {
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
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }
                    if (error) {
                        return <ErrorMessage message={"Datos no disponibles"}/>;
                    }
                    if (data) {
                        let summary = getSummary(
                            data.retrieveAllAirStations,
                            data.retrieveAllWaterStations,
                            data.retrieveAllPollenMeasures,
                        );
                        return (
                            <Box m={1}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={4}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            classes={{root: classes.button}}
                                            style={{backgroundColor: statusColors[summary[0].status]}}
                                            onClick={() => history.replace("/pollen/info")}
                                        >
                                            <Grid
                                                container
                                                spacing={0}
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs={4}>
                                                    <LocalFloristIcon
                                                        style={{fontSize: 100, verticalAlign: "middle"}}
                                                        color="primary"
                                                    />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography style={{fontSize: 50}} color="primary">
                                                        Polen
                                                    </Typography>
                                                    <Typography style={{fontSize: 20}} color="primary">
                                                        {summary[0].message}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            classes={{root: classes.button}}
                                            style={{backgroundColor: statusColors[summary[1].status]}}
                                            onClick={() => history.replace("/water/info")}
                                        >
                                            <Grid
                                                container
                                                spacing={0}
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs={4}>
                                                    <OpacityIcon
                                                        style={{fontSize: 100, verticalAlign: "middle"}}
                                                        color="primary"
                                                    />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography style={{fontSize: 50}} color="primary">
                                                        Agua
                                                    </Typography>
                                                    <Typography style={{fontSize: 20}} color="primary">
                                                        {summary[1].message}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            classes={{root: classes.button}}
                                            style={{backgroundColor: statusColors[summary[2].status]}}
                                            onClick={() => history.replace("/air/info")}
                                        >
                                            <Grid
                                                container
                                                spacing={0}
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs={4}>
                                                    <CloudQueueIcon
                                                        style={{fontSize: 100, verticalAlign: "middle"}}
                                                        color="primary"
                                                    />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography style={{fontSize: 50}} color="primary">
                                                        Aire
                                                    </Typography>
                                                    <Typography style={{fontSize: 20}} color="primary">
                                                        {summary[2].message}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    }
                }}
            </Query>
        </div>
    );
}

export default DataSummary;
