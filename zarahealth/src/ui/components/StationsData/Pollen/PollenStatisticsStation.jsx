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
import {Line} from "react-chartjs-2";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";
import {Query} from "@apollo/react-components";
import gql from "graphql-tag";

const GET_ALL_POLLEN_STATIONS = gql`
  {
    retrieveAllPollenMeasures {
      id
      title
      observation{
        publicationDate
        value
      }
    }
}
`;

const GET_POLLEN_STATION = gql`
    query retrievePollenMeasure(
    $startDate: String!, 
    $endDate: String!,
    $idPollenMeasure: String!){
    retrievePollenMeasure(startDate: $startDate, endDate:$endDate , idPollenMeasure:$idPollenMeasure){
      title
      observation{
        publicationDate
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

export default function PollenStatisticsStations() {
    const [expanded, setExpanded] = React.useState("panel0");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Query query={GET_ALL_POLLEN_STATIONS}>
            {({data, loading, error}) => {
                if (loading) {
                    return <h1>Loading...</h1>;
                }

                if (error) {
                    return <h1>Error: {JSON.stringify(error)}</h1>;
                }

                if (data) {
                    let stations = data.retrieveAllPollenMeasures.sort((a, b) => a.title.localeCompare(b.title))
                    return (
                        <List>
                            {stations.map((station, index) => {
                                function datediff(first, second) {
                                    return Math.round((second - first) / (1000 * 60 * 60 * 24));
                                }

                                var startDate = new Date();
                                var endDate = new Date();
                                startDate.setFullYear(endDate.getFullYear() - 1);

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
                                                                    datediff(new Date(station.observation[0].publicationDate), new Date()) +
                                                                    " días"}
                                                                </Box>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Query query={GET_POLLEN_STATION}
                                                   variables={{
                                                       startDate: startDate,
                                                       endDate: endDate,
                                                       idPollenMeasure: station.id
                                                   }}>
                                                {({data, loading, error}) => {
                                                    if (loading) {
                                                        return <h1>Loading...</h1>;
                                                    }

                                                    if (error) {
                                                        return <h1>Error: {JSON.stringify(error)}</h1>;
                                                    }

                                                    if (data) {
                                                        let station = data.retrievePollenMeasure
                                                        let datasets = [];
                                                        let timestamps = [];

                                                        let results = station.observation.sort(
                                                            (a, b) => Date.parse(a.publicationDate) - Date.parse(b.publicationDate)
                                                        );

                                                        results = results.filter(result => result.value != "nulo");

                                                        if (results.length === 0) {
                                                            return (<h1>No hay datos</h1>);
                                                        } else {
                                                            function getPollenStatus(status) {
                                                                switch (status) {
                                                                    case "alto":
                                                                        return 3;
                                                                    case "moderado":
                                                                        return 2;
                                                                    case "bajo":
                                                                        return 1;
                                                                    default:
                                                                        return 0;
                                                                }
                                                            }

                                                            let resultsData = [];
                                                            for (const result of results) {
                                                                resultsData = results.map((result) => getPollenStatus(result.value));
                                                                if (results.length > timestamps.length) {
                                                                    timestamps = results.map((record) => record.publicationDate);
                                                                }
                                                            }

                                                            datasets.push({
                                                                label: "Nivel",
                                                                backgroundColor: "rgba(0, 0, 0, 0)",
                                                                borderColor: "#1abc9c",
                                                                data: resultsData,
                                                            });

                                                            function formatDate(string) {
                                                                var options = {
                                                                    year: 'numeric',
                                                                    month: 'numeric',
                                                                    day: 'numeric'
                                                                };
                                                                return new Date(string).toLocaleDateString([], options);
                                                            }

                                                            timestamps = timestamps.map((timestamp) =>
                                                                formatDate(timestamp)
                                                            );

                                                            return (
                                                                <List style={{width: "100%"}}>
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
                                                                                                callback: function (label, index, labels) {
                                                                                                    if (label === 1) {
                                                                                                        return "bajo";
                                                                                                    } else if (label === 2) {
                                                                                                        return "moderado";
                                                                                                    } else if (label === 3) {
                                                                                                        return "alto";
                                                                                                    } else {
                                                                                                        return null;
                                                                                                    }
                                                                                                },
                                                                                            },
                                                                                        }
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
                                                            );
                                                        }
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
    );
}
