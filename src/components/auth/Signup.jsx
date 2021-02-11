import React, { useRef, useState } from 'react';
import { Card, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const history = useHistory();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            await signup(email, password);

            history.push("/add-username");
            
        } catch {
            setError("Failed to create an account.");
        }

        setLoading(false);
    }

    return (
        <center>
            <div className="signup mt-5 w-100">
                <Card className="signup-card">
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required ref={emailRef} />
                            </Form.Group>

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required ref={passwordRef} />
                            </Form.Group>

                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" required ref={passwordConfirmRef} />
                            </Form.Group>
                            <button className="w-100 btn btn-outline-primary" type="submit" disabled={loading}>Sign Up</button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2" style={{ color:'white' }}>
                    Already have an account? <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
                </div>
            </div>
        </center>
    )
}