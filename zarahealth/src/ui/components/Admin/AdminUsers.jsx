import React, { useState, useEffect } from "react";
import {
    List,
    Box,
    Typography,
    CircularProgress,
    Grid,
} from "@material-ui/core";
import User from "./Users/User";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

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

const GET_USERS = gql`
  query RetrieveUsers($page: Int!, $limit: Int!) {
    retrieveUsers(page: $page, limit: $limit)
      @connection(key: "user", filter: []) {
      username
      name
      status
    }
  }
`;
const styles = {
    marginBottom: 70
};

function AdminUsers() {
    const classes = useStyles();
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const { data, loading, error, fetchMore } = useQuery(GET_USERS, {
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
                        return Object.assign({}, prev, {
                            retrieveFeeds: [
                                ...prev.retrieveUsers,
                                ...fetchMoreResult.retrieveUsers,
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
                fetchPage(Math.floor(data.retrieveUsers.length / 7) + 1);
            }
        };
        window.addEventListener("scroll", isScrolling);
        return () => window.removeEventListener("scroll", isScrolling);
    }, [data, fetchMore, isFetching, hasMoreData]);

    if (error) {
        return <h1>{JSON.stringify(error)}</h1>;
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
        <div style={styles}>
        <Box m={1}>
            <Typography color="white" style={{ paddingTop: 0, paddingLeft: 0 }}>
                <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                    Usuarios
                </Box>
            </Typography>
            <div className={classes.root}>
                <List>
                    {data.retrieveUsers.map((user, index) => {
                        return (
                            <Box m={1}>
                                <User user={user} />
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
        </Box>
        </div>
    );
}

export default AdminUsers;
