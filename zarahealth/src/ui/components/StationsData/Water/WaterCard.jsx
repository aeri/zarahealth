import React from "react";
import { Box, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
      height: theme.spacing(15),
    },
  },
}));

function WaterCard({ backgroundColor, elementName }) {
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <Paper elevation={3} style={{ backgroundColor: backgroundColor }}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography color="primary">
              <Box fontWeight="fontWeightRegular" m={1} fontSize={25}>
                {elementName}
              </Box>
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <WarningIcon
              color="primary"
              style={{ fontSize: 50, verticalAlign: "middle" }}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
export default WaterCard;
