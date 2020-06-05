import React, {useEffect} from "react";
import {Box, CircularProgress, Container, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControl from '@material-ui/core/FormControl';
import gql from "graphql-tag";
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
        paddingRight: 20
    },
}))(MuiExpansionPanelActions);


const UPDATE_IMAGE= gql`
  mutation uploadUserImage(
    $image: Upload!
  ) {
    uploadUserImage(
      image: $image
    ) {
      _id
    }
  }
`;

function AdminImage() {
    const classes = useStyles();

    const [fileToUpload, setFileToUpload] = React.useState([]);


    const handleChange = ({
                              target: {
                                  validity,
                                  files: [file],
                              },
                          }) => {
        if (validity.valid) {
            setFileToUpload(file);
        }
    };

    return (
        <div>
            <Mutation mutation={UPDATE_IMAGE}>
                {(uploadUserImage, {data, loading}) => {
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
                        uploadUserImage({
                            variables: {
                                image: fileToUpload,
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
                                                                    Imagen de usuario
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
                                                                                <input
                                                                                    type="file"
                                                                                    name="file"
                                                                                    onChange={handleChange}
                                                                                />
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

export default AdminImage;


