import firebase from "firebase";
import client from "../apollo/apolloClient";
import gql from "graphql-tag";

function sendTokenToServer(token) {
  client.mutate({
    mutation: gql`
      mutation SuscribeClient($token: String!) {
        suscribeClient(token: $token)
      }
    `,
    variables: {
      token: token,
    },
  });
}

export function initializeFirebase() {
  firebase.initializeApp({
    apiKey: "AIzaSyAJHXb6ocmU1d4VLV8ZRwX3fq5zn5Eh9JY",
    authDomain: "zarahealth.firebaseapp.com",
    databaseURL: "https://zarahealth.firebaseio.com",
    projectId: "zarahealth",
    storageBucket: "zarahealth.appspot.com",
    messagingSenderId: "394440469465",
    appId: "1:394440469465:web:8459c4e590a0a4ca8bc7c8",
    measurementId: "G-KL28FM46LZ",
  });
}

export function registerFCMToken() {
  if (firebase.messaging.isSupported()) {
    const element = document.createElement("a");
    element.addEventListener("click", (event) => {
      const messaging = firebase.messaging();
      messaging.requestPermission().then((_) => {
        messaging
          .getToken()
          .then((currentToken) => {
            if (currentToken) {
              //   console.log("Registriando token de FCM: ", currentToken);
              sendTokenToServer(currentToken);
            } else {
              console.log("No se ha obtenido el token de FCM");
            }
          })
          .catch((err) => {
            console.log("Error obteniedo token de FCM: ", err);
          });
      });

      messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        alert(payload.notification.title + '\n' + payload.notification.body);
      });
    });

    document.body.appendChild(element);
    element.click();
  }
}

export function registerFCMTokenRefreshCallback() {
  if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging();
    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((refreshedToken) => {
          //   console.log("Refrescando token de FCM");
          sendTokenToServer(refreshedToken);
        })
        .catch((err) => {
          console.log(
            "No se ha podido obtener el token refrescado de FCM: ",
            err
          );
        });
    });
  }
}
