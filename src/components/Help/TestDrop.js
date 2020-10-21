import React from 'react';
import {
    FormControl,
    MenuItem,
    Select,
} from "@material-ui/core";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            states: [],
            cities: [],
            SelectedCountry: '--Choose Country--',
            SelectedState: '--Choose State--'
        };
        this.changeCountry = this.changeCountry.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    componentDidMount() {
        this.setState({
            countries: [
                { name: 'Germany', states: [{ name: 'A', cities: ['Duesseldorf', 'Leinfelden-Echterdingen', 'Eschborn'] }] },
                { name: 'Spain', states: [{ name: 'B', cities: ['Barcelona'] }] },
                { name: 'USA', states: [{ name: 'C', cities: ['Downers Grove'] }] },
                { name: 'Mexico', states: [{ name: 'D', cities: ['Puebla'] }] },
                { name: 'India', states: [{ name: 'E', cities: ['Delhi', 'Kolkata', 'Mumbai', 'Bangalore'] }] },
            ]
        });
    }

    changeCountry(event) {
        this.setState({ SelectedCountry: event.target.value });
        this.setState({ states: this.state.countries.find(cntry => cntry.name === event.target.value).states });
    }

    changeState(event) {
        this.setState({ SelectedState: event.target.value });
        const stats = this.state.countries.find(cntry => cntry.name === this.state.SelectedCountry).states;
        this.setState({ cities: stats.find(stat => stat.name === event.target.value).cities });
    }

    render() {
        return (
            <div id="container">
                <h2>Cascading or Dependent Dropdown using React</h2>
                <FormControl>
                    <div>

                        <label>Country</label>
                        <Select placeholder="Country" value={this.state.SelectedCountry} onChange={this.changeCountry}>
                            <MenuItem>--Choose Country--</MenuItem>
                            {this.state.countries.map((e, key) => {
                                return <MenuItem key={key}>{e.name}</MenuItem>;
                            })}
                        </Select>
                    </div>

                    <div>
                        <label>State</label>
                        <Select placeholder="State" value={this.state.SelectedState} onChange={this.changeState}>
                            <MenuItem>--Choose State--</MenuItem>
                            {this.state.states.map((e, key) => {
                                return <MenuItem key={key}>{e.name}</MenuItem>;
                            })}
                        </Select>
                    </div>

                    <div>
                        <label>City</label>
                        <Select placeholder="City">
                            <MenuItem>--Choose City--</MenuItem>
                            {this.state.cities.map((e, key) => {
                                return <MenuItem key={key}>{e}</MenuItem>;
                            })}
                        </Select>
                    </div>
                </FormControl>
            </div>
        )
    }
}

export default Dropdown;