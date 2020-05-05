import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import tapOrClick from "react-tap-or-click";

import { ApolloConsumer } from "@apollo/react-components";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";

const GET_CURRENT_USER = gql`
  {
    currentUser @client {
      username
      name
      email
    }
  }
`;

function UserCard(props) {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data }) => {
        if (data === undefined || data.currentUser === null) {
          return (
            <div
              {...tapOrClick(() => {
                props.handleClickOpen();
                if (props.mobileOpen) {
                  props.handleDrawerToggle();
                }
              })}
            >
              <CardHeader
                avatar={<Avatar aria-label="avatar">A</Avatar>}
                action={
                  <IconButton aria-label="login">
                    <ExitToAppIcon />
                  </IconButton>
                }
                title="Anónimo"
                subheader="Iniciar sesión"
              />
            </div>
          );
        } else {
          return (
            <CardHeader
              avatar={
                <Avatar
                  aria-label="avatar"
                  src="https://avatars1.githubusercontent.com/u/3115756?s=460&u=f2730d80135af68a86e4e68b5e3b3e7849bb3471&v=4"
                />
              }
              title={
                data.currentUser.name.length > 15
                  ? data.currentUser.name.substring(0, 15) + "..."
                  : data.currentUser.name
              }
              subheader={
                data.currentUser.email.length > 15
                  ? data.currentUser.email.substring(0, 15) + "..."
                  : data.currentUser.email
              }
              action={
                <ApolloConsumer>
                  {(client) => (
                    <div
                      {...tapOrClick(() => {
                        client.resetStore();
                        localStorage.removeItem("apollo-cache-persist");
                        localStorage.removeItem("auth");
                      })}
                    >
                      <IconButton aria-label="login">
                        {/* TODO: cambiar icono */}
                        <ExitToAppIcon />
                      </IconButton>
                    </div>
                  )}
                </ApolloConsumer>
              }
            />
          );
        }
      }}
    </Query>
  );
}
export default UserCard;
