import React from "react";
import { Alert } from "react-bootstrap";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Column,
  Paging,
  Selection,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import axios from "axios";
import { auth } from "../components/auth/firebase";

let astroidData;
let day, id, name, diameter, velocity, approachDate;
let astroidArray = [];
let favouriteAstroidArray = [];

// function returnAstroidData(day, id, name, diameter, velocity, approachDate) {
//   return {
//     day: day,
//     id: id,
//     name: name,
//     diameter: diameter,
//     velocity: velocity,
//     approachDate: approachDate,
//   };
// }

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
      <>
        <Alert show={this.state.show} variant="success">
          <Alert.Heading>Success!!</Alert.Heading>
          <p>Astroid(s) added to favourites.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => this.setState({ show: false })}
              variant="outline-success"
            >
              Close
            </Button>
          </div>
        </Alert>

        {!this.state.show && (
          <Button
            className="btn btn-primary btn-sm mt-2"
            onClick={this.handleClick}
          >
            {this.state.addingAstroidsLoading
              ? "Loading..."
              : "Add to Favourites"}
          </Button>
        )}
      </>
    );
  }

  handleClick(event) {
    this.setState({ addingAstroidsLoading: true });

    const favouriteAstroids = this.state.selectedRowsData;

    Object.keys(favouriteAstroids).forEach(function (key) {
      let astroidId = favouriteAstroids[key].id;
      let astroidName = favouriteAstroids[key].name;
      let approachDate = favouriteAstroids[key].day;

      let elementsToPush = {
        astroidId: astroidId,
        astroidName: astroidName,
        astroidApproachDate: approachDate,
      };

      favouriteAstroidArray.push(elementsToPush);
    });

    // console.log(favouriteAstroidArray, "Printing Favourite Astroid Array");
    // console.log(favouriteAstroidArray[0].astroidName);
    // console.log(this.state.currentUser.displayName);

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
        // console.log(res.data);
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
      // console.log(key, "Printing Key");
      astroidData[key].forEach(function (individualAstroid) {
        day = key;
        id = individualAstroid.id;
        name = individualAstroid.name;
        diameter =
          individualAstroid.estimated_diameter.kilometers
            .estimated_diameter_max;
        velocity =
          individualAstroid.close_approach_data[0].relative_velocity
            .kilometers_per_hour;
        approachDate =
          individualAstroid.close_approach_data[0].close_approach_date;

        let elementToPush = {
          day: day,
          id: id,
          name: name,
          diameter: diameter,
          velocity: velocity,
          approachDate: approachDate,
        };

        astroidArray.push(elementToPush);
      });
    });

    this.setState({ loading: false });
  }

  render() {
    const { selectedRowKeys } = this.state;

    return (
      <div>
        {this.state.loading ? (
          <div>
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <div>
            <DataGrid
              id="id"
              dataSource={astroidArray}
              showBorders={true}
              keyExpr="id"
              onSelectionChanged={this.onSelectionChanged}
              ref={(ref) => (this.dataGrid = ref)}
              selectedRowKeys={selectedRowKeys}
            >
              <Selection mode="multiple" />

              <Paging defaultPageSize={15} />

              <Column
                dataField="approachDate"
                defaultSortIndex={1}
                defaultSortOrder="asc"
                caption="Approach Date"
                alignment="center"
              />
              <Column dataField="id" caption="Astroid Id" alignment="center" />
              <Column
                dataField="name"
                caption="Astroid Name"
                alignment="center"
              />
              <Column
                dataField="diameter"
                caption="Astroid Diameter(kms)"
                alignment="center"
              />
              <Column
                dataField="velocity"
                caption="Astroid Velocity"
                alignment="center"
              />
            </DataGrid>
            <div className="d-flex justify-content-between border-top border-dark">
              <Button
                className="mt-2 btn btn-info btn-sm"
                disabled={!selectedRowKeys.length}
                onClick={this.onClearButtonClicked}
                text="Clear Selection"
              />
              {this.AlertDismissible()}
            </div>
          </div>
        )}
      </div>
    );
  }
}