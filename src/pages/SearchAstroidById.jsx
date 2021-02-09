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
                    </center>
                </div>}
            </div>            
        );
    }
}