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
import ElementCard from "../ElementCard";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";
import CircularProgress from '@material-ui/core/CircularProgress';

import {Query} from "@apollo/react-components";
import gql from "graphql-tag";

const GET_AIR_STATION = gql`
  {
    retrieveAllAirStations {
      title
      records {
        contaminant
        date
        value
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


const styles = {
    marginBottom: 70
};

export default function AirInfoStations() {
    const [expanded, setExpanded] = React.useState("panel0");
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const statusColors = ["white", "#33d9b2", "#ffda79", "#ff6c65"];

    return (
        <div style={styles}>
            <Query query={GET_AIR_STATION}>
                {({data, loading, error}) => {
                    if (loading) {
                        return(
                            <div style={{ position: "absolute",
                                top: "15%",
                                left: "45%",
                                width: "100%",
                            }}>
                                <CircularProgress color="secondary"/>
                            </div>
                        );
                    }

                    if (error) {
                        return <h2 style={{color:"white"}}>The Air Data is not available at this moment</h2>;
                    }

                    if (data) {
                        let stations = data.retrieveAllAirStations.sort((a, b) => a.title.localeCompare(b.title))
                        return (
                            <List>
                                {stations.map((station, index) => {
                                    let recordsToDisplay = {};
                                    for (let record of station.records) {
                                        let currentRecord = recordsToDisplay[record.contaminant];
                                        if (currentRecord === undefined) {
                                            recordsToDisplay[record.contaminant] = record;
                                        } else {
                                            if (
                                                Date.parse(record.date) > Date.parse(currentRecord.date)
                                            ) {
                                                recordsToDisplay[record.contaminant] = record;
                                            }
                                        }
                                    }

                                    recordsToDisplay = Object.values(recordsToDisplay);

                                    const lastUpdate = recordsToDisplay.reduce(function (
                                        prev,
                                        current
                                    ) {
                                        return Date.parse(prev.date) > Date.parse(current.date)
                                            ? prev
                                            : current;
                                    });

                                    const diffInMinutes = Math.round(
                                        (new Date() - Date.parse(lastUpdate.date)) / 60000
                                    );

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
                                                                    style={{
                                                                        fontSize: 30,
                                                                        verticalAlign: "middle",
                                                                    }}
                                                                    color="primary"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={11}>
                                                                <Typography
                                                                    style={{paddingLeft: 8}}
                                                                    color="primary"
                                                                >
                                                                    <Box
                                                                        fontWeight="fontWeightMedium"
                                                                        fontSize={10}
                                                                        color="#2f3542"
                                                                    >
                                                                        {"hace " +
                                                                        diffInMinutes.toString() +
                                                                        " min"}
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
                                                            justify="flex-start"
                                                            alignItems="flex-start"
                                                        >
                                                            {recordsToDisplay.map((element, index) => {
                                                                return (
                                                                    <Grid item xs={4}>
                                                                        <ElementCard
                                                                            backgroundColor={statusColors[1]}
                                                                            elementName={element.contaminant}
                                                                            message={element.value}
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
        </div>
    );
}
