import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { auth } from "../auth/firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [])

    function signup(email, password, username) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    function deleteUser() {
        const username = currentUser.displayName;

        const user = {
            username: username
        }

        axios.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/newos-ytvpv/service/newos-users/incoming_webhook/deleteUser", user)
        .then((res) => {
             console.log("User Deleted");
             return currentUser.delete();
        }).catch(err => {
            console.log(err);
        });
    }

    function updateUsername(name) {
        return currentUser.updateProfile({
            displayName: name
        }).then(function() {
            // Update successful.
            console.log("Username Updated");
          }).catch(function(error) {
            // An error happened.
            console.log("Username update unsuccessful", error);
          });
    }

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateUsername,
        deleteUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}