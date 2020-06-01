import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Comment from "../components/Feed/Comment";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
}));

function CommentsView() {
    const classes = useStyles();
    return (
        <Box m={1}>
            <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                    Feed
                </Box>
            </Typography>
            <div className={classes.root}>
                <List>
                    {this.props.location.state.comments.map((comment, index) => {
                        return (
                            <Box m={1}>
                                <Comment post={comment}/>
                            </Box>
                        )
                    })}
                </List>
            </div>
        </Box>
    );
}

export default CommentsView;
