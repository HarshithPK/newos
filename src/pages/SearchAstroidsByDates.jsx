import React from "react";
import { Alert } from "react-bootstrap";
import DataGrid, {
    Column,
    Paging,
    Selection,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import axios from "axios";

import { auth } from "../components/auth/firebase";

//devexteme CSS
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.dark.css";

let astroidData;
let day,
    id,
    name,
    diameter,
    velocity,
    approachDate,
    orbitalDeterminationDate,
    missDistance,
    orbitalPeriod,
    inclination,
    firstObservationDate;
let astroidArray = [];
let favouriteAstroidArray = [];

export default class SearchAstroidDates extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            addingAstroidsLoading: false,
            selectedRowKeys: [],
            selectedRowsData: {},
            currentUser: auth.currentUser,
            message: "",
            show: false,
        };

        this.populateData = this.populateData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onClearButtonClicked = this.onClearButtonClicked.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.AlertDismissible = this.AlertDismissible.bind(this);
    }

    AlertDismissible() {
        return (
            <div>
                <Alert show={this.state.show} variant="success">
                    <Alert.Heading>Success!!</Alert.Heading>

                    <p>Astroid(s) added to favourites.</p>
                    <hr />

                    <div className="d-flex justify-content-end">
                        <Button
                            onClick={() => this.setState({ show: false })}
                            variant="outline-success">
                            Close
                        </Button>
                    </div>
                </Alert>

                {!this.state.show && (
                    <Button
                        className="btn btn-primary align-middle mt-2"
                        onClick={this.handleClick}>
                        {this.state.addingAstroidsLoading
                            ? "Loading..."
                            : "Add to Favourites"}
                    </Button>
                )}
            </div>
        );
    }

    handleClick(event) {
        this.setState({ addingAstroidsLoading: true });

        const favouriteAstroids = this.state.selectedRowsData;

        Object.keys(favouriteAstroids).forEach(function (key) {
            let astroidId = favouriteAstroids[key].id;
            let astroidName = favouriteAstroids[key].name;
            let orbitalDeterminationDate =
                favouriteAstroids[key].orbitalDeterminationDate;

            let elementsToPush = {
                astroidId: astroidId,
                astroidName: astroidName,
                orbitalDeterminationDate: orbitalDeterminationDate,
            };

            favouriteAstroidArray.push(elementsToPush);
        });

        const favourites = {
            username: this.state.currentUser.displayName,
            favouriteAstroids: favouriteAstroidArray,
        };

        axios
            .post(
                "https://webhooks.mongodb-realm.com/api/client/v2.0/app/newos-ytvpv/service/newos-users/incoming_webhook/addAstroid",
                favourites
            )
            .then((res) => {
                this.setState({ message: "Astroid(s) added to favourites." });
                this.setState({ show: true });
                this.setState({ addingAstroidsLoading: false });
                this.onClearButtonClicked();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onSelectionChanged({ selectedRowKeys, selectedRowsData }) {
        this.setState({
            selectedRowsData,
            selectedRowKeys,
        });
    }

    onClearButtonClicked() {
        this.dataGrid.instance.clearSelection();
    }

    componentDidMount() {
        const apiKey = "8Y2qxegMmSkdHok4yoOjRm9HASPZpTgkQhwcZ6Aj";
        const startDate = this.props.match.params.startDate;
        const endDate = this.props.match.params.endDate;
        this.fetchData(startDate, endDate, apiKey);
    }

    async fetchData(startDate, endDate, apiKey) {
        const url =
            "https://api.nasa.gov/neo/rest/v1/feed?start_date=" +
            startDate +
            "&end_date=" +
            endDate +
            "&api_key=" +
            apiKey +
            "&detailed=true";

        const response = await fetch(url);
        const data = await response.json();

        astroidData = data.near_earth_objects;

        this.populateData();
    }

    populateData() {
        Object.keys(astroidData).forEach(function (key) {
            astroidData[key].forEach(function (individualAstroid) {
                day = key;
                id = individualAstroid.id;
                name = individualAstroid.name;
                diameter = individualAstroid.estimated_diameter.kilometers.estimated_diameter_max
                    .toString()
                    .substring(0, 7);
                velocity = individualAstroid.close_approach_data[0].relative_velocity.kilometers_per_hour
                    .toString()
                    .substring(0, 9);
                approachDate =
                    individualAstroid.close_approach_data[0]
                        .close_approach_date;
                orbitalDeterminationDate =
                    individualAstroid.orbital_data.orbit_determination_date;
                missDistance = individualAstroid.close_approach_data[0].miss_distance.kilometers
                    .toString()
                    .substring(0, 7);
                orbitalPeriod = individualAstroid.orbital_data.orbital_period
                    .toString()
                    .substring(0, 7);
                inclination = individualAstroid.orbital_data.inclination
                    .toString()
                    .substring(0, 7);
                firstObservationDate =
                    individualAstroid.orbital_data.first_observation_date;

                let elementToPush = {
                    day: day,
                    id: id,
                    name: name,
                    diameter: diameter,
                    velocity: velocity,
                    approachDate: approachDate,
                    orbitalDeterminationDate: orbitalDeterminationDate,
                    missDistance: missDistance,
                    orbitalPeriod: orbitalPeriod,
                    inclination: inclination,
                    firstObservationDate: firstObservationDate,
                };

                astroidArray.push(elementToPush);
            });
        });

        this.setState({ loading: false });
    }

    render() {
        const { selectedRowKeys } = this.state;

        return (
            <center>
                <div>
                    <h2 className="neo-feed-heading mt-3">Neo - Feed</h2>

                    {this.state.loading ? (
                        <div>
                            <div
                                className="spinner-border text-warning mt-5"
                                role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 mb-5">
                            <p className="neo-feed-description-text ml-4 mr-4">
                                The below table shows a list of astroids on
                                approach to earth between{" "}
                                <strong>
                                    {this.props.match.params.startDate}
                                </strong>{" "}
                                and{" "}
                                <strong>
                                    {this.props.match.params.endDate}
                                </strong>
                                . The astroids are ordered based on their
                                closest approach date to earth. The astroids can
                                be selected and then added to favourites to be
                                viewed on a later date.
                            </p>
                            <DataGrid
                                id="id"
                                className="mt-4"
                                dataSource={astroidArray}
                                showBorders={true}
                                keyExpr="id"
                                onSelectionChanged={this.onSelectionChanged}
                                ref={(ref) => (this.dataGrid = ref)}
                                selectedRowKeys={selectedRowKeys}
                                wordWrapEnabled={true}>
                                <Selection mode="multiple" />

                                <Paging defaultPageSize={10} />

                                <Column
                                    dataField="approachDate"
                                    defaultSortIndex={1}
                                    defaultSortOrder="asc"
                                    caption="Approach Date"
                                    alignment="center"
                                />

                                <Column
                                    dataField="orbitalDeterminationDate"
                                    caption="Determination Date"
                                    alignment="center"
                                />

                                <Column
                                    dataField="firstObservationDate"
                                    caption="First Observation Date"
                                    alignment="center"
                                />

                                <Column
                                    dataField="id"
                                    caption="Astroid Id"
                                    alignment="center"
                                />

                                <Column
                                    dataField="name"
                                    caption="Astroid Name"
                                    alignment="center"
                                />

                                <Column
                                    dataField="diameter"
                                    caption="Astroid Diameter (Kms)"
                                    alignment="center"
                                />

                                <Column
                                    dataField="velocity"
                                    caption="Astroid Velocity (Kph)"
                                    alignment="center"
                                />

                                <Column
                                    dataField="missDistance"
                                    caption="Astroid Miss-Distance (Kms)"
                                    alignment="center"
                                />

                                <Column
                                    dataField="orbitalPeriod"
                                    caption="Orbital Period"
                                    alignment="center"
                                />

                                <Column
                                    dataField="inclination"
                                    caption="Astroid Inclination"
                                    alignment="center"
                                />
                            </DataGrid>

                            <div className="d-flex justify-content-between border-top border-dark">
                                <Button
                                    className="mt-2 btn btn-info btn-sm mb-3"
                                    disabled={!selectedRowKeys.length}
                                    onClick={this.onClearButtonClicked}
                                    text="Clear Selection"
                                />

                                {this.AlertDismissible()}
                            </div>
                        </div>
                    )}
                </div>
            </center>
        );
    }
}
