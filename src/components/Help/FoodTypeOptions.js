import React from "react";

class FoodTypeOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="row">
        <div className="">
          <form action="#">
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Fruits:</span>
                <span> Apples, Pears, Plums, Peaches, Cherries </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Vegetables: </span><span> Tomatoes, Peppers, Cabbage </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Protein</span><span> Soy, Quinoa, Peanuts</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Grains</span><span> Wheat, Corn, Sunflower </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Vines</span><span> Desert</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span style={{ color: "black" }}>Beries</span><span> Raspberries, Blackberries, Blueberries, Strawberries, Chokeberries </span>
              </label>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default FoodTypeOptions;
