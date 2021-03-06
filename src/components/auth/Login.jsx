import React, { useRef, useState } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();
  const history = useHistory();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to sign in.");
    }

    setLoading(false);
  }

  return (
    <center>
      <div className="login mt-5 w-100">
        <Card className="login-card">
          <Card.Body>
            <h2 className="login-text text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required ref={emailRef} />
              </Form.Group>

              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required ref={passwordRef} />
              </Form.Group>

              <button
                className="w-100 mt-1 btn btn-outline-primary"
                type="submit"
                disabled={loading}
              >
                Login
              </button>
            </Form>

            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2" style={{ color: "white" }}>
          Need an account?{" "}
          <Link className="btn btn-primary btn-sm" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </center>
  );
}
