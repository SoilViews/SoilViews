import React from "react";

class FoodTypeOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange () {
    this.setState = {
      checked: !this.state.checked
    };
  };
  render() {
    return (
      <form action="#">
        <div className="row">
          <div className="col s6">
            <p>
              <label>
                <input name="fruits" type="checkbox" checked={this.state.checked} onChange={this.handleChange} />
                <span style={{ color: "black" }}>Fruits:</span>
                <span> Apples, Pears, Plums, Peaches, Cherries </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Vegetables: </span>
                <span> Tomatoes, Peppers, Cabbage </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Protein</span>
                <span> Soy, Quinoa, Peanuts</span>
              </label>
            </p>
          </div>
          <div className="col s6">
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Grains</span>
                <span> Wheat, Corn, Sunflower </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Vines</span>
                <span> Desert</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Beries</span>
                <span> Raspberries, Blackberries, Blueberries, Strawberries </span>
              </label>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

export default FoodTypeOptions;
