import React from "react";
import Button from "@material-ui/core/Button";
import { Container, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { GoogleLogin } from "react-google-login";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";
import { ApolloConsumer } from "@apollo/react-components";

import { handleGoogleAuthentication } from "../../core/services/tokenService";
import config from "../../core/misc/config";

const GET_USER = gql`
  query retrieveUser {
    retrieveUser {
      name
      username
      email
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  googleSignIn: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#4c8bf5",
    "&:hover": {
      backgroundColor: "#0f64f2",
    },
    progress: {
      display: "flex",
      justifyContent: "center",
      margin: theme.spacing(3),
    },
  },
}));

export function GoogleSignIn() {
  const classes = useStyles();
  const [retrieveUser, { loading, data, error }] = useLazyQuery(GET_USER);
  const [isLoginRequested, setRequested] = React.useState(false);

  const responseGoogle = (response) => {
    setRequested(false);
    handleGoogleAuthentication(response.accessToken).then(() => {
      retrieveUser();
    });
  };

  if (loading || isLoginRequested) {
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
      <Container component="main" maxWidth="xs">
        Ha ocurrido un error: {JSON.stringify(error)}
      </Container>
    );
  }

  if (data) {
    return (
      <Container component="main" maxWidth="xs">
        <ApolloConsumer>
          {(client) => {
            client.clearStore();
            client.writeData({ data: { currentUser: data.retrieveUser } });
            return <div>Login completo: {JSON.stringify(data)} </div>;
          }}
        </ApolloConsumer>
      </Container>
    );
  }

  return (
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
      onSuccess={responseGoogle}
      onRequest={() => setRequested(true)}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
}
