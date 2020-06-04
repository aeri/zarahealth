import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import gql from "graphql-tag";
import BlockIcon from "@material-ui/icons/Block";
import CheckIcon from "@material-ui/icons/Check";
import { ApolloConsumer, Mutation } from "@apollo/react-components";
import { CircularProgress } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const UPDATE_USER_STATUS = gql`
  mutation updateUserStatus($username: String!, $status: UserStatus!) {
    updateUserStatus(username: $username, status: $status) {
      status
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
}));

export default function User({ user }) {
  const classes = useStyles();

  return (
    <div>
      <Mutation mutation={UPDATE_USER_STATUS}>
        {(updateUserStatus, { data, loading }) => {
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

          if (data !== undefined) {
            return (
              <ApolloConsumer>
                {() => {
                  return (
                    <div>
                      <Card className={classes.root}>
                        <CardHeader
                          action={
                            <IconButton
                              aria-label="settings"
                              onClick={() => window.location.reload()}
                            >
                              <ClearIcon />
                            </IconButton>
                          }
                          title="Estado actualizado correctamente"
                        />
                      </Card>
                    </div>
                  );
                }}
              </ApolloConsumer>
            );
          }

          const handleSubmit = (e) => {
            e.preventDefault();
            console.log(user.username);
            console.log(user.status === "ENABLED" ? "BANNED" : "ENABLED");
            updateUserStatus({
              variables: {
                username: user.username,
                status: user.status === "ENABLED" ? "BANNED" : "ENABLED",
              },
            });
          };

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Card className={classes.root}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="avatar"
                      src={
                        "https://zgz.herokuapp.com/file/picture?type=username&username=" +
                        user.username
                      }
                    />
                  }
                  action={
                    user.status === "ENABLED" ? (
                      <IconButton aria-label="settings" type="submit">
                        <BlockIcon />
                      </IconButton>
                    ) : (
                      <IconButton aria-label="settings" type="submit">
                        <CheckIcon />
                      </IconButton>
                    )
                  }
                  title={user.name}
                  subheader={user.username}
                />
              </Card>
            </form>
          );
        }}
      </Mutation>
    </div>
  );
}
