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
                <span style={{ color: "black" }}>Овошки:</span>
                <span> Ябълки, Круши, Сливи, Праскови, Череши </span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span>Vegetables</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span>Protein</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span>Grains</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span>Vines</span>
              </label>
            </p>
            <p>
              <label>
                <input type="checkbox" />
                <span>Beries</span>
              </label>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default FoodTypeOptions;
