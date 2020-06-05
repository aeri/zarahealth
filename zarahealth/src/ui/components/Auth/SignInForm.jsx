import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {Container, CircularProgress, Box, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import config from "../../../core/misc/config";

import {
  handleUserAuthentication,
  handleGoogleAuthentication,
} from "../../../core/services/tokenService";

import { GoogleLogin } from "react-google-login";
import gql from "graphql-tag";
import { ApolloConsumer } from "@apollo/react-components";
import { useLazyQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import DialogContentText from "@material-ui/core/DialogContentText";

const GET_USER = gql`
  query retrieveUser {
    retrieveUser {
      username
      name
      email
      isAdmin
      csvDownloadEnabled
      image {
        _id
        filename
        mimetype
        encoding
      }
      preferredAirStation {
        id
        title
        address
        thresholds {
          contaminant
          value
        }
      }
      preferredWaterStation {
        id
        title
        address
      }
      pollenThresholds {
        id
        value
      }
      status
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
  },
  progress: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(3),
  },
  googleSignIn: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#4c8bf5",
    "&:hover": {
      backgroundColor: "#0f64f2",
    },
  },
}));

const handleGoogleError = (response) => {
  console.log('[GOOGLE AUTH ERROR]: ' + response);
};

export function SignInForm() {
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();

  const [retrieveUser, { loading, data, error }] = useLazyQuery(GET_USER);

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
        <DialogContentText  align={"center"}>
          <Typography component="div">
            <Box fontWeight="fontWeightMedium" m={4} fontSize={18} color="black">
              No se ha podido iniciar sesión
            </Box>
          </Typography>
        </DialogContentText>
    );
  }

  if (data) {
    console.log(JSON.stringify(data));
    return (
      <Container component="main" maxWidth="xs">
        <ApolloConsumer>
          {(client) => {
            client.writeData({ data: { currentUser: data.retrieveUser } });
            return null;
          }}
        </ApolloConsumer>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit((data) => {
          localStorage.removeItem("apollo-cache-persist");
          handleUserAuthentication(data.username, data.password).then(() => {
            retrieveUser();
          });
        })}
      >
        <TextField
          error={errors.username}
          inputRef={register({ required: true })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de usuario"
          name="username"
          autoComplete="username"
          autoFocus
          helperText={errors.username && "El campo es obligatorio"}
        />
        <TextField
          error={errors.password}
          inputRef={register({ required: true })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          helperText={errors.password && "El campo es obligatorio"}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {"Iniciar sesión"}
        </Button>
      </form>
      <GoogleLogin
        clientId={config.google.client_id}
        render={(renderProps) => (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            color="primary"
            className={classes.googleSignIn}
          >
            {"Iniciar sesión con Google"}
          </Button>
        )}
        onSuccess={(response) => {
          localStorage.removeItem("apollo-cache-persist");
          handleGoogleAuthentication(response.accessToken).then(() => {
            retrieveUser();
          });
        }}
        onFailure={handleGoogleError}
        cookiePolicy={"single_host_origin"}
      />
    </Container>
  );
}
