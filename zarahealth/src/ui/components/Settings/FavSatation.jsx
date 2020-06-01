import React from "react";
import {Box, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
            width: "100%",

        },
    },
    list: {
        width: 200,
        overflow: 'auto',
    },
}));


function FavStation() {
    const classes = useStyles();
    const fakeFavStations = [
        {
            name: "Estación 0",
            fav: true
        },
        {
            name: "Estación 1",
            fav: false
        },
        {
            name: "Estación 2",
            fav: false
        },
        {
            name: "Estación 3",
            fav: false
        },
    ];
    const [favStations, setFavStations] = React.useState(fakeFavStations);

    return (
        <div className={classes.paper}>
            <Paper elevation={3}>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 20, paddingTop: 10}}>
                    <Grid item xs={12}>
                        <Typography color="primary">
                            <Box fontWeight="fontWeightRegular" m={1} fontSize={27}>
                                Estación preferida
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container direction="column" justify="flex-start" style={{paddingLeft: 20}}>
                    <Grid item xs={12}>
                        <List dense component="div" role="list" className={classes.list}>
                            {favStations.map((station) => {
                                return (
                                    <ListItem  role="listitem" button>
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={station.fav}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText  primary={station.name}/>
                                    </ListItem>
                                );
                            })}
                            <ListItem/>
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default FavStation;


