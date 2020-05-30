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
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";
import DownloadButton from "../DownloadButton";

const GET_ALL_WATER_STATIONS = gql`
  {
    retrieveAllWaterStations {
      id
      title
      results {
        creationDate
        result
      }
    }
  }
`;

const GET_WATER_STATION = gql`
  query retrieveWaterStation(
    $startDate: String!
    $endDate: String!
    $idWaterStation: Int!
  ) {
    retrieveWaterStation(
      startDate: $startDate
      endDate: $endDate
      idWaterStation: $idWaterStation
    ) {
      title
      results {
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

const styles = {
  marginBottom: 70,
};

export default function WaterStatisticsStations() {
  const [expanded, setExpanded] = React.useState("panel0");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={styles}>
      <Query query={GET_ALL_WATER_STATIONS}>
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
            let stations = data.retrieveAllWaterStations.sort((a, b) =>
              a.title.localeCompare(b.title)
            );
            return (
              <List>
                {stations.map((station, index) => {
                  function datediff(first, second) {
                    return Math.round((second - first) / (1000 * 60 * 60 * 24));
                  }

                  var startDate = new Date();
                  var endDate = new Date();
                  startDate.setFullYear(endDate.getFullYear() - 2);

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
                                      datediff(
                                        new Date(
                                          station.results[0].creationDate
                                        ),
                                        new Date()
                                      ) +
                                      " días"}
                                  </Box>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Query
                          query={GET_WATER_STATION}
                          variables={{
                            startDate: startDate,
                            endDate: endDate,
                            idWaterStation: station.id,
                          }}
                        >
                          {({ data, loading, error }) => {
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

                            if (error) {
                              return (
                                <h2 style={{ color: "white" }}>
                                  Error: {JSON.stringify(error)}
                                </h2>
                              );
                            }

                            if (data) {
                              let station = data.retrieveWaterStation;
                              let datasets = [];
                              let timestamps = [];

                              const results = station.results.sort(
                                (a, b) =>
                                  Date.parse(a.creationDate) -
                                  Date.parse(b.creationDate)
                              );

                              function getWaterStatus(status) {
                                switch (status) {
                                  case "APTA PARA EL CONSUMO":
                                    return 1;
                                  case "Apta para el consumo":
                                    return 1;
                                  default:
                                    return 0;
                                }
                              }

                              let resultsData = [];
                              for (const result of results) {
                                resultsData = results.map((result) =>
                                  getWaterStatus(result.result)
                                );
                                if (results.length > timestamps.length) {
                                  timestamps = results.map(
                                    (record) => record.creationDate
                                  );
                                }
                              }

                              datasets.push({
                                label: "Apta para el consumo",
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                borderColor: "#1abc9c",
                                data: resultsData,
                              });

                              function formatDate(string) {
                                var options = {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                };
                                return new Date(string).toLocaleDateString(
                                  [],
                                  options
                                );
                              }

                              timestamps = timestamps.map((timestamp) =>
                                formatDate(timestamp)
                              );

                              return (
                                <List style={{ width: "100%" }}>
                                  <Grid
                                    container
                                    spacing={1}
                                    direction="column"
                                    justify="center"
                                    alignItems="flex-end"
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
                                                callback: function (
                                                  label,
                                                  index,
                                                  labels
                                                ) {
                                                  if (label === 1) {
                                                    return "Si";
                                                  } else {
                                                    return "No";
                                                  }
                                                },
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
                                    <DownloadButton
                                        kind="agua"
                                        title={station.title}
                                        data={station.results}
                                      />
                                  </Grid>
                                </List>
                              );
                            }
                          }}
                        </Query>
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
