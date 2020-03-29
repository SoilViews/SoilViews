import React from 'react';
 
const LandSelect = React.Component({
  getInitialState: function(){
    return {
      value: 'select'
    }
  },
  change: function(event){
    this.setState({value: event.target.value});
  },
  render: function(){
    return(
      <div>
        <select id="iOption" onChange={this.change} value={this.state.value}>
          <option>Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <p></p>
        <p>{this.state.value}</p>
      </div>
    );
  }
});

export default LandSelect


