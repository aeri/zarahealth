import React, { useState, useEffect } from "react";
import {
  List,
  Box,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import FloatingActionButton from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Post from "../components/Feed/Post";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import NewPostDialog from "../components/Feed/NewPost";
import ErrorMessage from "../components/common/ErrorMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    fill: "white",
  },
}));

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
      pictures {
        _id
      }
    }
  }
`;

function FeedView() {
  const classes = useStyles();

  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      page: 1,
      limit: 10,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    const fetchPage = (page) => {
      if (!isFetching) {
        setIsFetching(true);
        fetchMore({
          variables: { page: page },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (
              !fetchMoreResult ||
              fetchMoreResult.retrieveFeeds.length === 0
            ) {
              setHasMoreData(false);
              return prev;
            }

            if (fetchMoreResult.retrieveFeeds.length < 10) {
              setHasMoreData(false);
            }

            return Object.assign({}, prev, {
              retrieveFeeds: [
                ...prev.retrieveFeeds,
                ...fetchMoreResult.retrieveFeeds,
              ],
            });
          },
        }).then((_) => setIsFetching(false));
      }
    };

    const isScrolling = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (data && hasMoreData) {
        fetchPage(Math.floor(data.retrieveFeeds.length / 7) + 1);
      }
    };
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling);
  }, [data, fetchMore, isFetching, hasMoreData]);

  if (error) {
    return <ErrorMessage message={"Datos no disponibles"} />;
  }

  if (
    loading &&
    (data === undefined || (data !== undefined && data.length === 0))
  ) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress color="secondary" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box m={1}>
      <NewPostDialog
        open={showNewPostDialog}
        handleClose={() => setShowNewPostDialog(false)}
      />
      <Typography color="white" style={{ paddingTop: 0, paddingLeft: 0 }}>
        <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
          Feed
        </Box>
      </Typography>
      <div className={classes.root}>
        <List>
          {data.retrieveFeeds.map((post, index) => {
            return (
              <Box m={1}>
                <Post post={post} />
              </Box>
            );
          })}
          {hasMoreData && (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: "20vh" }}
            >
              <Grid item xs={3}>
                {isFetching && <CircularProgress color="secondary" />}
              </Grid>
            </Grid>
          )}
        </List>
      </div>
      <FloatingActionButton
        onClick={() => setShowNewPostDialog(true)}
        color="secondary"
        variant="extended"
        className={classes.fab}
      >
        <EditIcon className={classes.extendedIcon} />
        <h4 style={{ color: "white" }}>Publicar</h4>
      </FloatingActionButton>
    </Box>
  );
}

export default FeedView;
