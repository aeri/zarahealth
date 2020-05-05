import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import { Divider, Container } from "@material-ui/core";

import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";


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



function DialogFooter(props) {
  return (
    <Container component="main" maxWidth="xs">
      <Divider />

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
