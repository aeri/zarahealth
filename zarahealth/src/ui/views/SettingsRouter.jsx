import React from "react";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { CircularProgress } from "@material-ui/core";
import AdminView from "./AdminView";
import SettingsView from "./SettingsView";

const IS_ADMIN = gql`
  {
    currentUser @client {
      isAdmin
    }
  }
`;

export function SettingsRouter(props) {
  return (
    <Query query={IS_ADMIN}>
      {({ data }) => {
        if (data !== undefined && data.currentUser !== undefined) {
          if (data.currentUser.isAdmin) {
            return <AdminView />;
          } else {
            return <SettingsView />;
          }
        }
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
      }}
    </Query>
  );
}
