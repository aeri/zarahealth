import React, {useEffect} from "react";
import {Box, CircularProgress, Container, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from '@material-ui/core/FormControl';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import zaraHealthTheme from "../../theme";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import GetAppIcon from "@material-ui/icons/GetApp";
import {Controller, useForm} from "react-hook-form";
import {ApolloConsumer, Mutation} from "@apollo/react-components";
import {handleUserAuthentication} from "../../../core/services/tokenService";


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

const GET_CURRENT_USER = gql`
  {
    currentUser @client {
      csvDownloadEnabled
    }
  }
`;

const UPDATE_CSV = gql`
  mutation UpdateCsvDownloadEnabled(
    $csvDownloadEnabled:  Boolean!
  ) {
    updateCsvDownloadEnabled(
      csvDownloadEnabled: $csvDownloadEnabled
    ) {
      name
      username
      email
      csvDownloadEnabled
    }
  }
`;

function UserDownload() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_CURRENT_USER);
    const [enableCSV, setEnableCSV] = React.useState(false);


    useEffect(() => {
        if ((data !== undefined && data.currentUser !== null)) {
            setEnableCSV(data.currentUser.csvDownloadEnabled)
        }

    }, [data, error, loading]);

    return (
        <div>
            <Mutation mutation={UPDATE_CSV}>
                {(updateCsvDownloadEnabled, {data, loading}) => {
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
                                {(client) => {
                                    client.writeData({data: {currentUser: data.updateCsvDownloadEnabled}});
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
                        updateCsvDownloadEnabled({
                            variables: {
                                csvDownloadEnabled: enableCSV,
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
                                                                                control={<Switch checked={enableCSV}
                                                                                                 onChange={(event) => {
                                                                                                     setEnableCSV(!enableCSV);
                                                                                                 }}
                                                                                                 name="checkedA"/>}
                                                                                label="Habilitar descarga CSV"
                                                                            />
                                                                            <FormControl margin={'dense'}>
                                                                                <Grid container spacing={0}
                                                                                      direction="row"
                                                                                      justify="center"
                                                                                      alignItems="center">
                                                                                    <Grid item xs={1}>
                                                                                        <GetAppIcon style={{
                                                                                            fontSize: 30,
                                                                                            verticalAlign: "middle",
                                                                                        }}/>
                                                                                    </Grid>
                                                                                    <Grid item xs={11} justify="center"
                                                                                          alignItems="center">
                                                                                        <Typography
                                                                                            style={{
                                                                                                fontSize: 16,
                                                                                                paddingLeft: 25
                                                                                            }}
                                                                                            color="primary">
                                                                                            Descargar datos de cuenta
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                </Grid>


                                                                            </FormControl>
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

export default UserDownload;


