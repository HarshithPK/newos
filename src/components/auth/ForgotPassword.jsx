import React, { useRef, useState } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
  const emailRef = useRef();

  const { resetPassword } = useAuth();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Chech your inbox for further instructions.");
    } catch {
      setError("Failed to reset password.");
    }

    setLoading(false);
  }

  return (
    <center>
      <div className="forgot-password mt-5 w-100">
        <Card className="forgot-password-card">
          <Card.Body>
            <h2 className="password-reset-text text-center mb-4">
              Password Reset
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required ref={emailRef} />
              </Form.Group>

              <button
                className="btn btn-outline-primary w-100"
                type="submit"
                disabled={loading}
              >
                Reset Password
              </button>
            </Form>

            <div className="text-center mt-3">
              <Link className="btn btn-outline-primary" to="/login">
                Login
              </Link>
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
