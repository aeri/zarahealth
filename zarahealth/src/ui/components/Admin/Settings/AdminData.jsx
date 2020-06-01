import React, {useEffect} from "react";
import {Box, CircularProgress, Typography, withStyles} from "@material-ui/core";
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
import zaraHealthTheme from "../../../theme";

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
        padding: theme.spacing(0),
        paddingBottom: 15,
        paddingRight: 20
    },
}))(MuiExpansionPanelActions);

const GET_CURRENT_USER = gql`
 query currentUser {
    currentUser @client {
      username
      name
      email
    }
  }
`;


const UPDATE_USER = gql`
  mutation UpdateUser(
    $name: String!
    $password: String!
    $email: String!
  ) {
    updateUser(
      name: $name
      password: $password
      email: $email
    ) {
      name
      username
      email
      csvDownloadEnabled
    }
  }
`;

function AdminData() {
    const classes = useStyles();
    const {loading, data, error} = useQuery(GET_CURRENT_USER);
    const [passError, setPassError] = React.useState(false);

    const [candidateName, setCandidateName] = React.useState("");
    const [candidatePassword, setCandidatePassword] = React.useState("");
    const [candidatePassword2, setCandidatePassword2] = React.useState("");
    const [candidateEmail, setCandidateEmail] = React.useState("");


    useEffect(() => {
        if (loading || error) {

        }

        if ((data !== undefined && data.currentUser !== null)) {
            setCandidateName(data.currentUser.name)
            setCandidateEmail(data.currentUser.email)
        }

    }, [data, error, loading]);

    return (
        <div>
            <Mutation mutation={UPDATE_USER}>
                {(updateUser, {data, loading}) => {
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
                                    client.writeData({data: {currentUser: data.updateUser}});
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
                        if (candidatePassword !== candidatePassword2) {
                            setPassError(true)
                        } else {
                            updateUser({
                                variables: {
                                    name: candidateName,
                                    password: candidatePassword,
                                    email: candidateEmail
                                }
                            });
                        }
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
                                                                    Datos personales
                                                                </Box>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container direction="column" justify="flex-start"
                                                          style={{paddingLeft: 40}}>
                                                        <Grid item xs={12}>
                                                            <div>
                                                                <Grid container alignItems="center"
                                                                      style={{paddingBottom: 45}}>
                                                                    <Grid item>
                                                                        <FormGroup column style={{width: 300}}>
                                                                            <FormControl margin={'dense'}>
                                                                                <TextField id="standard-basic" required
                                                                                           label="Nombre"
                                                                                           value={candidateName}
                                                                                           onChange={(event) => {
                                                                                               setCandidateName(event.target.value);
                                                                                           }}/>
                                                                            </FormControl>
                                                                            <FormControl margin={'dense'}>
                                                                                <TextField id="standard-basic" required
                                                                                           label="Email"
                                                                                           value={candidateEmail}
                                                                                           onChange={(event) => {
                                                                                               setCandidateEmail(event.target.value);
                                                                                           }}/>
                                                                            </FormControl>

                                                                            <FormControl margin={'dense'}>
                                                                                <TextField id="standard-basic"
                                                                                           label="Contraseña nueva"
                                                                                           value={candidatePassword}
                                                                                           type="password"
                                                                                           onChange={(event) => {
                                                                                               setCandidatePassword(event.target.value);
                                                                                           }}/>
                                                                            </FormControl>
                                                                            <FormControl margin={'dense'}>
                                                                                <TextField id="standard-basic"
                                                                                           label="Repetir contraseña"
                                                                                           value={candidatePassword2}
                                                                                           type="password"
                                                                                           onChange={(event) => {
                                                                                               setCandidatePassword2(event.target.value);
                                                                                           }}/>
                                                                            </FormControl>
                                                                            {
                                                                                passError?
                                                                                    <Typography color="secondary">
                                                                                        <Box fontWeight="fontWeightRegular" m={1} fontSize={17} >
                                                                                            Las contraseñas no coinciden
                                                                                        </Box>
                                                                                    </Typography>
                                                                                    :
                                                                                    <div></div>
                                                                            }
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

export default AdminData;


