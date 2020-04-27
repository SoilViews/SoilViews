import React from 'react'

const Checkboxes = ({
    name,
    checked = false,
    onChange })  => (
        <input 
            type = 'checkbox'
            name = {name}
            checked = {checked}
            onChange = {onChange} 
        />
    );

    export default Checkboxes;

