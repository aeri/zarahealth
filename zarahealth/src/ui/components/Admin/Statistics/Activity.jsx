import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Activity({ activity }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title={activity.type}
        subheader={activity.count}
      />

    </Card>
  );
}
