import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import { DateTime } from "luxon";
import Comment from "./Comment";
import NewComment from "./NewComment";
import { Box, Divider } from "@material-ui/core";
import gql from "graphql-tag";
import { Mutation } from "@apollo/react-components";

const TOGGLE_STATUS = gql`
  mutation ToggleFeedOpinion($id: String!, $status: Opinion) {
    toggleFeedOpinion(id: $id, status: $status) {
      id
      likes
      dislikes
      status
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Post({ post }) {
  const classes = useStyles();
  const [isShowingComments, setShowingComments] = React.useState(false);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="avatar"
            src={
              "https://zgz.herokuapp.com/file/picture?type=username&username=" +
              post.author
            }
          />
        }
        title={post.author}
        subheader={DateTime.fromMillis(post.date * 1).toFormat(
          "dd/LL/yyyy HH:mm"
        )}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Mutation
          mutation={TOGGLE_STATUS}
          variables={{
            id: post.id,
            status: post.status === "LIKE" ? null : "LIKE",
          }}
        >
          {(toggleLike) => (
            <IconButton aria-label="like" onClick={toggleLike}>
              <ThumbUpIcon
                style={post.status === "LIKE" ? { fill: "red" } : {}}
              />
            </IconButton>
          )}
        </Mutation>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.likes}
        </Typography>
        <Mutation
          mutation={TOGGLE_STATUS}
          variables={{
            id: post.id,
            status: post.status === "DISLIKE" ? null : "DISLIKE",
          }}
        >
          {(toggleLike) => (
            <IconButton aria-label="dislike" onClick={toggleLike}>
              <ThumbDownIcon
                style={post.status === "DISLIKE" ? { fill: "red" } : {}}
              />
            </IconButton>
          )}
        </Mutation>

        <Typography variant="body2" color="textSecondary" component="p">
          {post.dislikes}
        </Typography>
        <IconButton
          aria-label="share"
          onClick={() => setShowingComments(!isShowingComments)}
        >
          <ChatBubbleIcon style={isShowingComments ? { fill: "red" } : {}} />
        </IconButton>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.comments.length}
        </Typography>
      </CardActions>
      {isShowingComments && (
        <CardContent>
          <List>
            <Box m={1}>
              <NewComment postId={post.id} />
            </Box>
            {post.comments.length > 0 && (
              <Box m={2}>
                <Divider />
              </Box>
            )}
            {post.comments.map((comment, _) => (
              <Box m={1}>
                <Comment comment={comment} />
              </Box>
            ))}
          </List>
        </CardContent>
      )}
    </Card>
  );
}
