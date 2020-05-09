import React from "react";
import {withStyles} from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import zaraHealthTheme from "../../../theme";
import ApartmentIcon from "@material-ui/icons/Apartment";
import Grid from "@material-ui/core/Grid";
import WifiIcon from "@material-ui/icons/Wifi";
import WaterCard from "./WaterCard";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";

import {Query} from "@apollo/react-components";
import gql from "graphql-tag";
import PollenCard from "../Pollen/PollenCard";

const GET_WATER_STATION = gql`
  {
    retrieveAllWaterStations {
      title
      results{
        creationDate
        result
      }
    }
}
`;


const ExpansionPanel = withStyles({
    root: {
        border: zaraHealthTheme.palette.primary.main,
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0,
        },
        "&:before": {
            display: "none",
        },
        "&$expanded": {
            margin: "auto",
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, .125)",
        marginBottom: -1,
        minHeight: 70,
        "&$expanded": {
            minHeight: 70,
        },
    },
    content: {
        "&$expanded": {
            margin: "12px 0",
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

export default function WaterInfoStation() {
    const [expanded, setExpanded] = React.useState("panel0");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const statusColors = ["white", "#33d9b2", "#ffda79", "#ff6c65"];

  function getWaterStatusColor(status) {
    switch (status) {
      case "APTA PARA EL CONSUMO":
        return statusColors[1];
      case "Apta para el consumo":
        return statusColors[1];
      default:
        return statusColors[3];
        ;
    }
  }

  function getStatusString(status) {
    switch (status) {
      case "APTA PARA EL CONSUMO":
        return statusColors[1];
      case "Apta para el consumo":
        return statusColors[1];
      default:
        return statusColors[3];
        ;
    }
  }

    return (
        <Query query={GET_WATER_STATION}>
            {({data, loading, error}) => {
                if (loading) {
                    return <h1>Loading...</h1>;
                }

                if (error) {
                    return <h1>Error: {JSON.stringify(error)}</h1>;
                }
                if (data) {
                    let stations = data.retrieveAllWaterStations.sort((a, b) => a.title.localeCompare(b.title))
                    return (
                        <List>
                            {stations.map((station, index) => {
                              function datediff(first, second) {
                                return Math.round((second-first)/(1000*60*60*24));
                              }
                                return (
                                    <ExpansionPanel
                                        square
                                        expanded={expanded === "panel" + index}
                                        onChange={handleChange("panel" + index)}
                                    >
                                        <ExpansionPanelSummary
                                            aria-controls="panel1d-content"
                                            id="panel1d-header"
                                        >
                                            <Grid
                                                container
                                                spacing={3}
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs={1}>
                                                    <ApartmentIcon
                                                        style={{fontSize: 40, verticalAlign: "middle"}}
                                                        color="primary"
                                                    />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography
                                                        style={{fontSize: 30, paddingLeft: 25}}
                                                        color="primary"
                                                    >
                                                        {station.title}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        justify="center"
                                                        alignItems="center"
                                                    >
                                                        <Grid item xs={3}>
                                                            <WifiIcon
                                                                style={{fontSize: 30, verticalAlign: "middle"}}
                                                                color="primary"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={11}>
                                                            <Typography style={{paddingLeft: 8}} color="primary">
                                                                <Box
                                                                    fontWeight="fontWeightMedium"
                                                                    fontSize={10}
                                                                    color="#2f3542"
                                                                >
                                                                    {"hace " +
                                                                    datediff(new Date(station.results[0].creationDate), new Date()) +
                                                                    " días"}
                                                                </Box>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <List style={{width: "100%"}}>
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
                                                        {station.results.map((result, index) => {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <WaterCard
                                                                        backgroundColor={getWaterStatusColor(result.result)}
                                                                        elementName={result.result}
                                                                    />
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Grid>
                                            </List>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                );
                            })}
                        </List>
                    );
                }
            }}
        </Query>
    );
}
