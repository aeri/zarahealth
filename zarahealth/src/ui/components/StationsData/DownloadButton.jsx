import React from "react";
import { IconButton } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import downloadJSONFile from "../../../core/services/downloadService";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";

const IS_DOWNLOAD_ENABLED = gql`
  {
    currentUser @client {
      csvDownloadEnabled
    }
  }
`;
function DownloadButton(props) {
  return (
    <Query query={IS_DOWNLOAD_ENABLED}>
      {({ data }) => {
        if (data !== undefined && data.currentUser.csvDownloadEnabled) {
          return (
            <IconButton
              onClick={() =>
                downloadJSONFile(
                  props.kind,
                  props.title,
                  JSON.stringify(props.data)
                )
              }
            >
              <CloudDownloadIcon style={{ fill: "white" }} />
            </IconButton>
          );
        }
        return null;
      }}
    </Query>
  );
}

export default DownloadButton;
