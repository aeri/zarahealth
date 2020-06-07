import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import { DateTime } from "luxon";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Comment({ comment }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="avatar"
            src={
              "https://zgz.herokuapp.com/file/picture?type=username&username=" +
              comment.author
            }
          />
        }
        title={comment.author}
        subheader={DateTime.fromMillis(comment.date * 1).toFormat(
          "dd/LL/yyyy HH:mm"
        )}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {comment.body}
        </Typography>
      </CardContent>
    </Card>
  );
}
