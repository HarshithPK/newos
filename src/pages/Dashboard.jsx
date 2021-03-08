import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";
import axios from "axios";

import DataGrid, { Column, Paging } from "devextreme-react/data-grid";

import { useAuth } from "../components/contexts/AuthContext";

//devexteme CSS
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.dark.css";

let favouriteAstroidArray = [];

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { currentUser, logout } = useAuth();

    const history = useHistory();

    useEffect(() => {
        let favouriteAstroids = {};

        async function loadFavouriteAstroids() {
            const username = currentUser.displayName;

            const user = {
                username: username,
            };

            console.log(user);

            await axios
                .post(
                    "https://webhooks.mongodb-realm.com/api/client/v2.0/app/newos-ytvpv/service/newos-users/incoming_webhook/returnFavouriteAstroids",
                    user
                )
                .then((res) => {
                    favouriteAstroids = res.data[0].favouriteAstroids;
                })
                .catch((err) => {
                    console.log(err);
                });

            console.log("Printing Favourite Astroids", favouriteAstroids);

            Object.keys(favouriteAstroids).forEach(function (key) {
                console.log(favouriteAstroids[key]);
                const level1 = favouriteAstroids[key];

                Object.keys(level1).forEach(function (key1) {
                    console.log("Printing Level 1", level1[key1]);
                    console.log(
                        "Printing astroid name",
                        level1[key1].astroidName
                    );

                    const elementsToPush = {
                        astroidId: level1[key1].astroidId,
                        astroidName: level1[key1].astroidName,
                        orbitalDeterminationDate:
                            level1[key1].orbitalDeterminationDate,
                    };

                    favouriteAstroidArray.push(elementsToPush);
                });

                console.log(
                    "Printing Favourite Astroid Array ",
                    favouriteAstroidArray
                );
            });

            setLoading(false);
        }

        loadFavouriteAstroids();
    }, [currentUser]);

    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/login");
        } catch {
            setError("Failed to log out.");
        }
    }

    return (
        <center>
            <div className="dashboard mt-5 mb-5">
                {loading ? (
                    <div>
                        <div
                            className="spinner-border text-warning"
                            role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <div
                            className="profile-card w-100"
                            style={{ maxWidth: "400px" }}>
                            <Card className="user-info">
                                <Card.Body className="text-center">
                                    <h2 className="profile-text text-center mb-4">
                                        Profile
                                    </h2>
                                    {error && (
                                        <Alert variant="danger">{error}</Alert>
                                    )}
                                    <strong className="label-text">
                                        Username:
                                    </strong>{" "}
                                    {currentUser.displayName}
                                    <br></br>
                                    <strong className="label-text">
                                        Email:
                                    </strong>{" "}
                                    {currentUser.email}
                                    <br></br>
                                    <Link
                                        to="/update-profile"
                                        className="btn btn-outline-primary w-72 mt-3">
                                        Update Profile
                                    </Link>
                                </Card.Body>

                                <div className="w-100 text-center mb-2">
                                    <Link
                                        to="/delete-account"
                                        className="btn btn-outline-danger w-72 mt-3">
                                        Delete Account
                                    </Link>
                                </div>

                                <div className="w-100 text-center mb-2">
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}>
                                        Log Out
                                    </button>
                                </div>
                            </Card>
                        </div>

                        <DataGrid
                            className="mt-5"
                            id="astroidId"
                            dataSource={favouriteAstroidArray}
                            showBorders={true}
                            keyExpr="astroidId"
                            wordWrapEnabled={true}
                            rowAlternationEnabled={true}
                            showColumnLines={true}>
                            <Paging defaultPageSize={5} />

                            <Column
                                dataField="orbitalDeterminationDate"
                                defaultSortIndex={1}
                                defaultSortOrder="asc"
                                caption="Determination Date"
                                alignment="center"
                            />

                            <Column
                                dataField="astroidId"
                                caption="Astroid Id"
                                alignment="center"
                            />

                            <Column
                                dataField="astroidName"
                                caption="Astroid Name"
                                alignment="center"
                            />
                        </DataGrid>
                    </div>
                )}
            </div>
        </center>
    );
}
