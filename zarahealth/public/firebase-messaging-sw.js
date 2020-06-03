importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js"
);

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

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
}
