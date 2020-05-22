import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import SendIcon from "@material-ui/icons/Send";
import { red } from "@material-ui/core/colors";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import {
  TextField,
  Grid,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Mutation } from "@apollo/react-components";

const ADD_COMMENT = gql`
  mutation SubmitComment($id: String!, $body: String!) {
    submitComment(id: $id, body: $body) {
      id
      comments {
        author
        body
        date
      }
    }
  }
`;
const GET_CURRENT_USER = gql`
  {
    currentUser @client {
      username
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

export default function NewComment(props) {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset } = useForm();

  return (
    <Query query={GET_CURRENT_USER}>
      {({ data }) => {
        return (
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {data.currentUser.username.charAt(0)}
                </Avatar>
              }
              title={data.currentUser.username}
            />
            <CardContent>
              <Mutation mutation={ADD_COMMENT}>
                {(addComment, { loading }) => {
                  return (
                    <form
                      noValidate
                      onSubmit={handleSubmit((data) => {
                        addComment({
                          variables: {
                            id: props.postId,
                            body: data.comment,
                          },
                        });
                        reset();
                      })}
                    >
                      <Grid container alignItems="center">
                        <Grid item xs={10}>
                          <TextField
                            error={errors.comment}
                            inputRef={register({ required: true })}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="comment"
                            multiline
                            label="Nuevo comentario"
                            name="comment"
                            autoFocus
                            helperText={errors.comment && "No has escrito nada"}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton aria-label="share" type="sumbit">
                            {loading ? (
                              <CircularProgress color="secondary" />
                            ) : (
                              <SendIcon style={{ fill: "red" }} />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </form>
                  );
                }}
              </Mutation>
            </CardContent>
          </Card>
        );
      }}
    </Query>
  );
}
