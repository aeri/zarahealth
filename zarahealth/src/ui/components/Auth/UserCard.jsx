import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import tapOrClick from "react-tap-or-click";
import history from "../../../core/misc/history";
import { ApolloConsumer } from "@apollo/react-components";

function UserCard(props) {
  if (!props.isAuthenticated) {
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
            src={
              props.currentUser.image === undefined ||
              props.currentUser.image === null
                ? "https://i.ibb.co/G5VNNXd/default-user.jpg"
                : "https://zgz.herokuapp.com/file/picture?type=user&id=" +
                  props.currentUser.image._id
            }
          />
        }
        title={
          props.currentUser.name.length > 15
            ? props.currentUser.name.substring(0, 15) + "..."
            : props.currentUser.name
        }
        subheader={
          props.currentUser.email.length > 15
            ? props.currentUser.email.substring(0, 15) + "..."
            : props.currentUser.email
        }
        action={
          <ApolloConsumer>
            {(client) => (
              <div
                {...tapOrClick(() => {
                  if (props.mobileOpen) {
                    props.handleDrawerToggle();
                  }
                  history.replace("/");
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
}
export default UserCard;
