import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import {
  TextField,
  Button,
  makeStyles,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";

const FEED_QUERY = gql`
  query RetrieveFeeds($page: Int!, $limit: Int!) {
    retrieveFeeds(page: $page, limit: $limit)
      @connection(key: "feed", filter: []) {
      id
      title
      author
      body
      date
      likes
      dislikes
      status
      comments {
        author
        body
        date
      }
    }
  }
`;

const ADD_POST = gql`
  mutation SubmitFeed($title: String!, $body: String!) {
    submitFeed(title: $title, body: $body) {
      id
      title
      author
      body
      date
      likes
      dislikes
      status
      comments {
        author
        body
        date
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
  },
}));

function NewPostDialog(props) {
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { submitFeed } }) {
      const { retrieveFeeds } = cache.readQuery({ query: FEED_QUERY });
      cache.writeQuery({
        query: FEED_QUERY,
        data: { retrieveFeeds: [submitFeed, ...retrieveFeeds] },
      });
      props.handleClose();
    },
  });

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Nueva publicación"}</DialogTitle>
      <DialogContent>
        {
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit((data) => {
              addPost({
                variables: {
                  title: data.title,
                  body: data.body,
                  pictures: [],
                },
              });
            })}
          >
            <TextField
              error={errors.title}
              inputRef={register({ required: true })}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Título"
              name="title"
              autoFocus
              helperText={errors.title && "No has escrito nada"}
            />
            <TextField
              error={errors.body}
              inputRef={register({ required: true })}
              variant="outlined"
              margin="normal"
              required
              multiline
              rows={5}
              fullWidth
              id="body"
              label="Mensaje"
              name="body"
              autoFocus
              helperText={errors.body && "No has escrito nada"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {"Publicar"}
            </Button>
          </form>
        }
      </DialogContent>
    </Dialog>
  );
}

export default NewPostDialog;
