import React, {useEffect} from "react";
import {Box, CircularProgress, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import zaraHealthTheme from "../../../theme";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {ApolloConsumer, Mutation} from "@apollo/react-components";


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
            width: "100%",

        },
    },

}));

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const ExpansionPanelActions = withStyles((theme) => ({
    root: {
        backgroundColor: zaraHealthTheme.palette.primary.main,
        padding: theme.spacing(1),
        paddingBottom: 15,
        paddingRight: 20
    },
}))(MuiExpansionPanelActions);


const GET_SETTINGS = gql`
  {
    retrieveSettings {
      id
      water
      pollen
      air
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateSatatus(
    $id:  String!
    $airStatus:  Boolean!
    $waterStatus:  Boolean!
    $pollenStatus:  Boolean!
  ) {
    updateAirStatus(
      id: $id
      airStatus: $airStatus
    ) {
      id
    }
    updateWaterStatus(
      id: $id
      waterStatus: $waterStatus
    ) {
      id
    }
    updatePollenStatus(
      id: $id
      pollenStatus: $pollenStatus
    ) {
      id
    }
  }
`;

function DataSources() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_SETTINGS);
    const [settingsId, setSettingsId] = React.useState(false);
    const [enableAir, setEnableAir] = React.useState(false);
    const [enableWater, setEnableWater] = React.useState(false);
    const [enablePollen, setEnablePollen] = React.useState(false);


    useEffect(() => {
        if (loading || error) {

        }

        if ((data !== undefined && data.retrieveSettings !== null)) {
            setSettingsId(data.retrieveSettings[0].id)
            setEnableAir(data.retrieveSettings[0].air)
            setEnableWater(data.retrieveSettings[0].water)
            setEnablePollen(data.retrieveSettings[0].pollen)
        }

    }, [data, error, loading]);

    return (
        <div>
            <Mutation mutation={UPDATE_STATUS}>
                {(updateSatatus, {data, loading}) => {
                    if (loading) {
                        return <div style={{ position: "relative",
                            top: "15%",
                            left: "45%",
                            width: "100%",
                        }}>
                            <CircularProgress color="secondary"/>
                        </div>
                    }

                    if (data !== undefined) {
                        return (
                            <ApolloConsumer>
                                {() => {
                                    return (
                                        <div>
                                            <ExpansionPanelDetails>
                                                <Grid container spacing={1} direction="column"
                                                      justify="center"
                                                      alignItems="center">
                                                    <Grid container spacing={1} direction="row"
                                                          justify="center"
                                                          alignItems="center">
                                                        <Grid item xs={12}>
                                                            <div className={classes.paper}>
                                                                <Paper elevation={3}>
                                                                    <Grid container direction="column"
                                                                          justify="flex-start"
                                                                          style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>
                                                                        <Grid item xs={12}>
                                                                            <Typography color="primary">
                                                                                <Box fontWeight="fontWeightRegular"
                                                                                     m={1} fontSize={23}>
                                                                                    Datos actualizados correctamente
                                                                                </Box>
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Paper>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </ExpansionPanelDetails>
                                            <ExpansionPanelActions>
                                                <Button size="medium" color="secondary" onClick={() => window.location.reload()}>
                                                    Aceptar
                                                </Button>
                                            </ExpansionPanelActions>
                                        </div>
                                    );
                                }}
                            </ApolloConsumer>
                        );
                    }

                    const handleSubmit = (e) => {
                        e.preventDefault()
                        updateSatatus({
                            variables: {
                                id:  settingsId,
                                airStatus:  enableAir,
                                waterStatus:  enableWater,
                                pollenStatus:  enablePollen
                            }
                        });
                    }

                    return (
                        <form
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <ExpansionPanelDetails>
                                <Grid container spacing={1} direction="column"
                                      justify="center"
                                      alignItems="center">
                                    <Grid container spacing={1} direction="row"
                                          justify="center"
                                          alignItems="center">
                                        <Grid item xs={12}>
                                            <div className={classes.paper}>
                                                <Paper elevation={3}>
                                                    <Grid container direction="column" justify="flex-start"
                                                          style={{paddingLeft: 20, paddingTop: 10}}>
                                                        <Grid item xs={12}>
                                                            <Typography color="primary">
                                                                <Box fontWeight="fontWeightRegular" m={1} fontSize={27}>
                                                                    Descarga
                                                                </Box>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container direction="column" justify="flex-start"
                                                          style={{paddingLeft: 40}}>
                                                        <Grid item xs={12}>
                                                            <div>
                                                                <Grid container spacing={2} alignItems="center"
                                                                      style={{paddingBottom: 15}}>
                                                                    <Grid item>
                                                                        <FormGroup column>
                                                                            <FormControlLabel
                                                                                control={<Switch checked={enableAir}
                                                                                                 onChange={(event) => {
                                                                                                     setEnableAir(!enableAir);
                                                                                                 }}
                                                                                                 name="checkedA"/>}
                                                                                label="Aire"
                                                                            />
                                                                            <FormControlLabel
                                                                                control={<Switch checked={enableWater}
                                                                                                 onChange={(event) => {
                                                                                                     setEnableWater(!enableWater);
                                                                                                 }}
                                                                                                 name="checkedA"/>}
                                                                                label="Agua"
                                                                            />
                                                                            <FormControlLabel
                                                                                control={<Switch checked={enablePollen}
                                                                                                 onChange={(event) => {
                                                                                                     setEnablePollen(!enablePollen);
                                                                                                 }}
                                                                                                 name="checkedA"/>}
                                                                                label="Polen"
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                            <ExpansionPanelActions>
                                <Button size="medium" style={{color: "white"}} onClick={() => window.location.reload()}>Cancelar</Button>
                                <Button size="medium" color="secondary" type="submit">
                                    Guardar
                                </Button>
                            </ExpansionPanelActions>
                        </form>
                    );
                }}
            </Mutation>
        </div>
    );
}

export default DataSources;


