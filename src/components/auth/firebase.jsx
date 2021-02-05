import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
    apiKey: process.env.React_APP_FIREBASE_API_KEY,
    authDomain: process.env.React_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.React_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.React_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.React_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.React_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.React_APP_FIREBASE_APP_ID

//     apiKey: "AIzaSyDXcP0rrnkimOQWXYXJuacMMA4HCsBmBmQ",
// authDomain: "auth-production-a5523.firebaseapp.com",
// databaseURL: "https://auth-production-a5523-default-rtdb.firebaseio.com",
// projectId: "auth-production-a5523",
// storageBucket: "auth-production-a5523.appspot.com",
// messagingSenderId: "838550396493",
// appId: "1:838550396493:web:08661e44201fa2a5094604"
});

export const auth = app.auth();
export default app;