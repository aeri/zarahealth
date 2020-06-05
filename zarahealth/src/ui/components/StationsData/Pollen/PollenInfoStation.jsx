import React from "react";
import {withStyles} from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import zaraHealthTheme from "../../../theme";
import Grid from "@material-ui/core/Grid";
import PollenCard from "./PollenCard";
import {Box, CircularProgress} from "@material-ui/core";
import List from "@material-ui/core/List";

import {Query} from "@apollo/react-components";
import gql from "graphql-tag";
import ErrorMessage from "../../common/ErrorMessage";

const GET_POLLEN_STATION = gql`
  {
    retrieveAllPollenMeasures {
      id
      title
      description
      reino
      familia
      image
      observation{
        publicationDate
        value
      }
    }
}
`;



const styles = {
    marginBottom: 70
};

export default function PollenInfoSatation() {
    const [expanded, setExpanded] = React.useState("panel0");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const statusColors = ["white", "#33d9b2", "#ffda79", "#ff6c65"];

    function getPollenStatusColor(status) {
        switch (status) {
            case "bajo":
                return statusColors[1];
            case "alto":
                return statusColors[3];
            default:
                return statusColors[2];
                ;
        }
    }

    return (
        <Box m={2}>
            <div style={styles}>
            <Query query={GET_POLLEN_STATION}>
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
                        return <ErrorMessage message={'Datos no disponibles'}/>
                    }
                    if (data) {
                        return (
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
                                        {data.retrieveAllPollenMeasures.map((element, index) => {
                                            return (
                                                element.observation[0].value !== "nulo"?
                                                <Grid item xs={6}>
                                                    <PollenCard
                                                        backgroundColor={getPollenStatusColor(element.observation[0].value)}
                                                        elementName={element.title}
                                                        message={element.observation[0].value === "nulo" ? "no info" : element.observation[0].value}
                                                        lastUpdate={element.observation[0].publicationDate}
                                                    />
                                                </Grid>
                                                    :
                                                    <div></div>
                                            );
                                        })}
                                    </Grid>
                                </Grid>
                            </List>
                        );
                    }
                }}
            </Query>
        </div>
        </Box>

    );
}
