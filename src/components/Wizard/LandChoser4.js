import React, { Component } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import UloadFile from './UploadFile'
import Dashboard from '../dashboard/Dashboard'
import LandNumberInput from './LandNumberInput'
import CoordinatesInput from './CoordinatesInput'

const options = [
    'one', 'two', 'three'
]
class LandChoser4 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: '',
    }
    this._onSelect = this._onSelect.bind(this)
  }

  _onSelect (option) {
    console.log('You selected ', option.label)
  }

  render () {
    const defaultOption = this.state.selected
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label
    const panels = [
        <UloadFile />,
        <CoordinatesInput />,
        <LandNumberInput />,
        <Dashboard />
    ]

    return (
      <section>
        <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
        <div className='result'>
          You selected
          <strong> {placeHolderValue} </strong>
        </div>
      </section>
    )
  }
}

export default LandChoser4