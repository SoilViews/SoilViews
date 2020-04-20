import React from "react";

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
    <p>
      <label>
        <input
          type="checkbox"
          name={label}
          checked={isSelected}
          onChange={onCheckboxChange}
          className="form-check-input"
        />
        <span>{label}</span>
      </label>
    </p>

);

export default Checkbox;
