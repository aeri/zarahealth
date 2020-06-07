import React from "react";
import {Box, CircularProgress, Typography, withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import zaraHealthTheme from "../../theme";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import MuiExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import gql from "graphql-tag";
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
        padding: theme.spacing(1),
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

const styles = {
    marginBottom: 70
};

const SEND_ALERT = gql`
  mutation sendAlert(
    $title: String!
    $body: String!
    $level: Level!
  ) {
    sendAlert(
      title: $title
      body: $body
      level: $level
    ) {
      title
    }
  }
`;


export default function AdminBroadcast() {
    const classes = useStyles();

    const [candidateTitle, setCandidateTitle] = React.useState("");
    const [candidateMessage, setCandidateMessage] = React.useState("");
    const [candidateLevel, setCandidateLevel] = React.useState("");

    const [formError, setFormError] = React.useState(false);


    return (
        <div style={styles}>
            <Box m={1}>
                <Typography color="white" style={{paddingTop: 0, paddingLeft: 0}}>
                    <Box fontWeight="fontWeightMedium" m={1} fontSize={45} color="white">
                        Avisos
                    </Box>
                </Typography>
                <Mutation mutation={SEND_ALERT}>
                    {(sendAlert, {data, loading}) => {
                        if (loading) {
                            return <div style={{
                                position: "relative",
                                top: "30%",
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
                                                                              style={{
                                                                                  paddingLeft: 20,
                                                                                  paddingTop: 10,
                                                                                  paddingBottom: 10
                                                                              }}>
                                                                            <Grid item xs={12}>
                                                                                <Typography color="primary">
                                                                                    <Box fontWeight="fontWeightRegular"
                                                                                         m={1} fontSize={23}>
                                                                                        Aviso enviado correctamente
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
                                                    <Button size="medium" color="secondary"
                                                            onClick={() => window.location.reload()}>
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
                            if (candidateTitle === "" || candidateMessage === "" || candidateLevel === "") {
                                setFormError(true)
                            } else {
                                sendAlert({
                                    variables: {
                                        title: candidateTitle,
                                        body: candidateMessage,
                                        level: candidateLevel
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
                                                                    <Box fontWeight="fontWeightRegular" m={1}
                                                                         fontSize={27}>
                                                                        Datos del aviso
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
                                                                                    <TextField id="standard-basic"
                                                                                               required
                                                                                               label="Tiítulo"
                                                                                               value={candidateTitle}
                                                                                               onChange={(event) => {
                                                                                                   setCandidateTitle(event.target.value);
                                                                                               }}/>
                                                                                </FormControl>
                                                                                <FormControl margin={'dense'}>
                                                                                    <TextField id="standard-basic"
                                                                                               required
                                                                                               label="Mensaje"
                                                                                               multiline
                                                                                               rows={3}
                                                                                               rowsMax={10}
                                                                                               value={candidateMessage}
                                                                                               onChange={(event) => {
                                                                                                   setCandidateMessage(event.target.value);
                                                                                               }}/>
                                                                                </FormControl>
                                                                                <FormControl margin={'dense'}>
                                                                                    <InputLabel>Nivel</InputLabel>
                                                                                    <Select
                                                                                        id="demo-simple-select"
                                                                                        value={candidateLevel}
                                                                                        required
                                                                                        onChange={(event) => {
                                                                                            setCandidateLevel(event.target.value);
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem
                                                                                            value={"NOTICE"}>Aviso</MenuItem>
                                                                                        <MenuItem
                                                                                            value={"WARNING"}>Advertencia</MenuItem>
                                                                                        <MenuItem
                                                                                            value={"ALERT"}>Alerta</MenuItem>
                                                                                    </Select>
                                                                                </FormControl>
                                                                                {
                                                                                    formError ?
                                                                                        <Typography color="secondary">
                                                                                            <Box
                                                                                                fontWeight="fontWeightRegular"
                                                                                                m={1} fontSize={17}
                                                                                                style={{paddingTop: 20}}>
                                                                                                Complete todos los
                                                                                                campos
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
                                    <Button size="medium" style={{color: "white"}}
                                            onClick={() => window.location.reload()}>Cancelar</Button>
                                    <Button size="medium" color="secondary" type="submit">
                                        Enviar
                                    </Button>
                                </ExpansionPanelActions>
                            </form>

                        );
                    }}
                </Mutation>
            </Box>
        </div>
    );
}
