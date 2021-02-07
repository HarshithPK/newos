import React from "react";

export default class SearchAstroidById extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            astroidData: {},
            loading: true
        }
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
                <h1>ID:{this.state.astroidData.id}</h1>
                <h1>Name:{this.state.astroidData.name}</h1>
                <h1>Diameter:{this.state.astroidData.estimated_diameter.kilometers.estimated_diameter_max}</h1>
                <h1>Orbital Determination date:{this.state.astroidData.orbital_data.orbit_determination_date}</h1>
                </div>}
            </div>            
        );
    }
}