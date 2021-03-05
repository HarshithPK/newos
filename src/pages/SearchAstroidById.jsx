import React from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import Button from "devextreme-react/button";

import { auth } from "../components/auth/firebase";

let favouriteAstroidArray = [];

export default class SearchAstroidById extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			astroidData: {},
			loading: true,
			addingAstroidsLoading: false,
			currentUser: auth.currentUser,
			message: "",
			show: false
		}

		this.AlertDismissible = this.AlertDismissible.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	async componentDidMount() {
		const apiKey = "8Y2qxegMmSkdHok4yoOjRm9HASPZpTgkQhwcZ6Aj";
		const astroidId = this.props.match.params.astroidId;
		const url = `https://api.nasa.gov/neo/rest/v1/neo/`+astroidId+`?api_key=`+apiKey;

		const response = await fetch(url);
		const data = await response.json();
		this.setState({astroidData: data});
		this.setState({loading: false});
	}

	AlertDismissible() {
		return (
			<div className="mt2" style={{ maxWidth: "300px" }}>
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
					className="btn btn-primary align-middle mt-2"
					onClick={this.handleClick}
					>
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
			
		let elementsToPush = {
			astroidId: this.state.astroidData.id,
			astroidName: this.state.astroidData.name,
			orbitalDeterminationDate: this.state.astroidData.orbital_data.orbit_determination_date
		};
			
		favouriteAstroidArray.push(elementsToPush);

		const favourites = {
			username: this.state.currentUser.displayName,
			favouriteAstroids: favouriteAstroidArray,
		};
			
		axios.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/newos-ytvpv/service/newos-users/incoming_webhook/addAstroid",favourites)
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

	render () {
		return (
			<div className="search-id-section mt-5">
				{this.state.loading ?
					<div>
						<div className="spinner-border text-warning" role="status">
							<span className="sr-only"></span>
						</div>
					</div> :

					<div className="individual-astroid-data-text">
						<center>
							<table className="individual-astroid-table">
								<tbody>
									<tr>
										<th>Astroid ID</th>
										<td>{this.state.astroidData.id}</td>
									</tr>

									<tr>
										<th>Name</th>
										<td>{this.state.astroidData.name}</td>
									</tr>

									<tr>
										<th>Diameter</th>
										<td>{this.state.astroidData.estimated_diameter.kilometers.estimated_diameter_max}</td>
									</tr>

									<tr>
										<th>Orbital Determination date</th>
										<td>{this.state.astroidData.orbital_data.orbit_determination_date}</td>
									</tr>  
								</tbody>    
							</table>
							{this.AlertDismissible()}
						</center>
					</div>
				}
			</div>            
		);
	}
}