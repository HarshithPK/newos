import React, { useRef, useState } from 'react';
import { Card, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from "../components/contexts/AuthContext";

export default function UpdateProfile() {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateEmail, updatePassword, updateUsername } = useAuth();
    const history = useHistory();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        const promises = [];
        setLoading(true);
        setError("");
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        if(usernameRef.current.value) {
            promises.push(updateUsername(usernameRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                history.push("/");
            }).catch(() => {
                setError("Failed to update account.")
            }).finally(() => {
                setLoading(false);
            })
    }

    return (
        <center>
            <div className="update-profile mt-5 w-100">
                <Card className="update-profile-card">
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group id="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" ref={usernameRef} placeholder="Enter your name" />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required ref={emailRef} defaultValue={currentUser.email} />
                            </Form.Group>

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} placeholder="Leave Blank to keep the same." />
                            </Form.Group>

                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave Blank to keep the same." />
                            </Form.Group>
                            <button className="btn btn-outline-primary w-100" type="submit" disabled={loading}>Update</button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link className="btn btn-outline-primary" to="/">Cancel</Link>
                </div>
            </div>
        </center>
    )
}