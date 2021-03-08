import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../components/contexts/AuthContext";

export default function DeleteAccount() {
    const { deleteUser } = useAuth();
    const history = useHistory();

    const [deletingUser, setDeletingUser] = useState(false);

    function handleClickNo() {
        history.push("/");
    }

    function handleClickYes() {
        setDeletingUser(true);
        deleteUser();
        setDeletingUser(false);
    }

    return (
        <center>
            <div className="delete-account-page">
                <Card className="delete-account-card">
                    <Card.Body>
                        <h2 className="w-100">Account Deletion</h2>
                        <p>
                            <strong>
                                Are you sure you want to delete your account?
                            </strong>
                        </p>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-around ">
                        <button
                            className="btn btn-outline-danger btn-lg w-50 ml-1"
                            onClick={handleClickYes}>
                            {deletingUser ? "Deleting User..." : "Yes"}
                        </button>
                        <button
                            className="btn btn-outline-success btn-lg w-50 ml-1"
                            onClick={handleClickNo}>
                            No
                        </button>
                    </Card.Footer>
                </Card>
            </div>
        </center>
    );
}
