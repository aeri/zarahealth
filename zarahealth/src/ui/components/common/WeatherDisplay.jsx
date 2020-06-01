import React from "react";
import Typography from "@material-ui/core/Typography";

import {
  ClearDay,
  ClearNight,
  Thunderstorm,
  ShowerRain,
  Rain,
  Snow,
  Mist,
  FewCloudsDay,
  FewCloudsNight,
} from "../../shared/Icons";

import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { CircularProgress, Grid, Box } from "@material-ui/core";

const GET_WEATHER = gql`
  {
    retrieveWeather {
      temp
      weathercode
    }
  }
`;

function getWeatherIcon(code) {
  const hour = new Date().getHours();
  const iconProps = { width: "30px", height: "30px", fill: "white" };
  if (code === 800) {
    if (hour > 5 && hour < 20) {
      return <ClearDay {...iconProps} />;
    } else {
      return <ClearNight {...iconProps} />;
    }
  }
  const weatherType = parseInt((code + "").charAt(0));
  switch (weatherType) {
    case 2:
      return <Thunderstorm {...iconProps} />;
    case 3:
      return <ShowerRain {...iconProps} />;
    case 5:
      return <Rain {...iconProps} />;
    case 6:
      return <Snow {...iconProps} />;
    case 7:
      return <Mist {...iconProps} />;
    case 8:
      if (hour > 5 && hour < 20) {
        return <FewCloudsDay {...iconProps} />;
      } else {
        return <FewCloudsNight {...iconProps} />;
      }
    default:
      return null;
  }
}

function WeatherDisplay(props) {
  return (
    <Query query={GET_WEATHER}>
      {({ data, loading, error }) => {
        if (loading) {
          return <CircularProgress />;
        }
        if (data) {
          return (
            <Box width={100}>
              <Grid
                container
                zeroMinWidth
                alignContent="center"
                alignItems="center"
                direction="row"
              >
                <Grid item xs={8} spacing={3} whiteSpace="nowrap">
                  <Typography variant="h6">
                    {Math.round(data.retrieveWeather.temp).toString() + "ºC"}
                  </Typography>
                </Grid>
                <Grid item xs={4} spacing={1} whiteSpace="nowrap">
                  {getWeatherIcon(data.retrieveWeather.weathercode)}
                </Grid>
              </Grid>
            </Box>
          );
        }
      }}
    </Query>
  );
}

export default WeatherDisplay;
