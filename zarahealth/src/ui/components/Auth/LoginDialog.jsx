import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import { GoogleLogin } from "react-google-login";
import { Divider, Container } from "@material-ui/core";

import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
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

function LoginDialog(props) {
  const [isLoginActive, setLoginActive] = React.useState(true);

  const toggleLoginRegister = () => {
    setLoginActive(!isLoginActive);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Iniciar sesión"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Inicias sesión en ZaraHealth para recibir actualizaciones
          personalizadas, participar en el feed público y mucho más
        </DialogContentText>
        {isLoginActive ? <SignInForm /> : <SignUpForm />}
        <DialogFooter
          isLoginActive={isLoginActive}
          toggleLoginRegister={toggleLoginRegister}
        />
      </DialogContent>
    </Dialog>
  );
}

const responseGoogle = (response) => {
  console.log(response);
};

function DialogFooter(props) {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <Divider />
      <GoogleLogin
        clientId="845896366322-hpt0ql3pa2rmufvikfhse3u2b8lvjoa4.apps.googleusercontent.com"
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
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />

      <Grid container>
        {props.isLoginActive ? (
          <Grid item xs>
            <Link variant="body2">{"¿Contraseña olvidada?"}</Link>
          </Grid>
        ) : null}
        <Grid item>
          <Link onClick={props.toggleLoginRegister} variant="body2">
            {props.isLoginActive
              ? "¿Aún no tienes una cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginDialog;
