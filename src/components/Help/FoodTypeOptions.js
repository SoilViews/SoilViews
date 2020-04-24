import React from "react";
import M from "materialize-css";

class FoodTypeOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll(".collapsible");
      var instances = M.Collapsible.init(elems);
      var instance = instances[0];
      instance.open(0);
    });
  }

  render() {
    return (
      <div className="row">
        <div className="">
          {/* +++++++++++++ */}
          <ul class="collapsible">
            <li>
              <div class="collapsible-header">
                <i class="material-icons">filter_drama</i>First
              </div>
              <div class="collapsible-body">
                <span>Lorem ipsum dolor sit amet.</span>
              </div>
            </li>
            <li>
              <div class="collapsible-header">
                <i class="material-icons">place</i>Second
              </div>
              <div class="collapsible-body">
                <span>Lorem ipsum dolor sit amet.</span>
              </div>
            </li>
            <li>
              <div class="collapsible-header">
                <i class="material-icons">whatshot</i>Third
              </div>
              <div class="collapsible-body">
                <span>Lorem ipsum dolor sit amet.</span>
              </div>
            </li>
          </ul>

          {/* +++++++++++++ */}
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
