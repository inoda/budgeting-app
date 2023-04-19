import React from 'react';
import ReactSelect from 'react-select'

const Select = ({ options, defaultValue, onChange }) => {
  const selectStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: 'rgba(111, 90, 208, 0.1)',
      boxShadow: isFocused ? '0px 0px 0px 2px rgba(111, 90, 208, 0.2) inset' : 'none',
      outline: 'none',
      padding: "8px",
      border: 'none',
    }),
    option: ((styles, { isSelected, isFocused }) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.9)",
      backgroundColor: isSelected ? 'rgba(111, 90, 208, 0.2)' : '#fff',
      '&:hover': { backgroundColor: isSelected ? 'rgba(111, 90, 208, 0.2)' : 'rgba(111, 90, 208, 0.1)' }
    })),
    singleValue: (styles) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.9)",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.9)",
    }),
  };

  return (
    <ReactSelect
      styles={selectStyles}
      options={options}
      onChange={o => onChange(o.value)}
      defaultValue={options.find(o => o.value === defaultValue)}
      components={{
        IndicatorSeparator: () => null
      }}
    />
  );
};

export default Select;
