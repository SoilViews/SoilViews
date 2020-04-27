import React from 'react'

const SelectedFood = (props) => {
    return ( 
        <div>
        <p>Selected:
            <p>{props.checkedItems}</p>
        </p>
    </div>
     );
}
 
export default SelectedFood;
