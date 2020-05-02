import React, {useState} from "react";
import {Box, Typography} from "@material-ui/core";
import Post from "../components/Feed/Post";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
    },
}));

function FeedView() {
    const classes = useStyles();
    const fakePosts = [{
        name: "Rafa",
        date: "September 14, 2016",
        message: "This impressive paella is a perfect party dish and a fun meal to cook together with your\n" +
            "                    guests. Add 1 cup of frozen peas along with the mussels, if you like.",
        likes: 10,
        dislikes: 20,
        comments: []
    },
        {
            name: "Ana",
            date: "September 15, 2016",
            message: "This impressive paella is a perfect party dish and a fun meal to cook together with your\n" +
                "                    guests. Add 1 cup of frozen peas along with the mussels, if you like.",
            likes: 10,
            dislikes: 20,
            comments: []
        },
        {
            name: "Juan",
            date: "September 16, 2016",
            message: "This impressive paella is a perfect party dish and a fun meal to cook together with your\n" +
                "                    guests. Add 1 cup of frozen peas along with the mussels, if you like.",
            likes: 10,
            dislikes: 20,
            comments: []
        },];
    const [posts, setPosts] = useState(fakePosts);
    return (
        <Box m={1}>
            <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                    Feed
                </Box>
            </Typography>
            <div className={classes.root}>
                <List>
                    {posts.map((post, index) => {
                        return (
                            <Box m={1}>
                                <Post post={post}/>
                            </Box>
                        )
                    })}
                </List>
            </div>
        </Box>
    );
}

export default FeedView;
