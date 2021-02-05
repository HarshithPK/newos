import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { useAuth } from "../components/contexts/AuthContext";

export default function AddUsername() {
    const usernameRef = useRef();
    const { currentUser, updateUsername } = useAuth();
    const history = useHistory();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();

        const promises = [];
        setLoading(true);
        setError("");

        if(usernameRef.current.value) {
            promises.push(updateUsername(usernameRef.current.value));
        }

        Promise.all(promises)
            .then(async () => {
                const user = {
                    username: currentUser.displayName,
                    favouriteAstroids: []
                }

                axios.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/newos-ytvpv/service/newos-users/incoming_webhook/insertEmptyUser", user)
                    .then( (res)=> {
                        console.log("User Created", res.data);
                    }).catch(err => {
                        console.log(err);
                    });

                history.push("/");
            }).catch(() => {
                setError("Failed to update account.")
            }).finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Add Username</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={ handleSubmit }>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} placeholder="Enter your name" />
                        </Form.Group>
                        <Button className="w-100" type="submit" disabled={loading}>Update</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}