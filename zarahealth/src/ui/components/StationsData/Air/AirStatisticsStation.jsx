import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import zaraHealthTheme from "../../../theme";
import ApartmentIcon from "@material-ui/icons/Apartment";
import Grid from "@material-ui/core/Grid";
import WifiIcon from "@material-ui/icons/Wifi";
import { Line } from "react-chartjs-2";
import { Box } from "@material-ui/core";
import List from "@material-ui/core/List";

import { DateTime } from "luxon";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  marginBottom: 70,
};

export default function AirStatisticsStations() {
  const [expanded, setExpanded] = React.useState("panel0");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={styles}>
      <Query query={GET_AIR_STATION}>
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

          if (data) {
            let stations = data.retrieveAllAirStations.sort((a, b) =>
              a.title.localeCompare(b.title)
            );
            return (
              <List>
                {stations.map((station, index) => {
                  let contaminantRecords = {};
                  for (let record of station.records) {
                    if (contaminantRecords[record.contaminant] === undefined) {
                      contaminantRecords[record.contaminant] = [record];
                    } else {
                      contaminantRecords[record.contaminant].push(record);
                    }
                  }

                  let datasets = [];
                  let timestamps = [];
                  const colors = [
                    "#1abc9c",
                    "#f39c12",
                    "#2980b9",
                    "#d35400",
                    "#bdc3c7",
                    "#8e44ad",
                    "#e74c3c",
                  ];
                  let colorCounter = 0;
                  for (let [contaminant, records] of Object.entries(
                    contaminantRecords
                  )) {
                    records = records.sort(
                      (a, b) => Date.parse(a.date) - Date.parse(b.date)
                    );
                    datasets.push({
                      label: contaminant,
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      borderColor: colors[colorCounter],
                      data: records.map((record) => record.value),
                    });
                    if (records.length > timestamps.length) {
                      timestamps = records.map((record) => record.date);
                    }
                    colorCounter++;
                  }

                  timestamps = timestamps.map((timestamp) =>
                    DateTime.fromISO(timestamp).toFormat("HH:mm")
                  );

                  const lastUpdate = station.records.reduce(function (
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
                              style={{ fontSize: 40, verticalAlign: "middle" }}
                              color="primary"
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              style={{ fontSize: 30, paddingLeft: 25 }}
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
                                  style={{ paddingLeft: 8 }}
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
                        <List style={{ width: "100%" }}>
                          <Grid
                            container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center"
                          >
                            <Line
                              data={{
                                labels: timestamps,
                                datasets: datasets,
                              }}
                              options={{
                                legend: {
                                  labels: {
                                    fontColor: "white",
                                    fontSize: 15,
                                  },
                                },
                                scales: {
                                  yAxes: [
                                    {
                                      ticks: {
                                        fontColor: "white",
                                        fontSize: 18,
                                        stepSize: 1,
                                        beginAtZero: true,
                                      },
                                    },
                                  ],
                                  xAxes: [
                                    {
                                      ticks: {
                                        fontColor: "white",
                                        fontSize: 14,
                                        stepSize: 1,
                                        beginAtZero: true,
                                      },
                                    },
                                  ],
                                },
                              }}
                            />
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
