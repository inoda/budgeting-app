import React from 'react';
import ReactSelect from 'react-select'

const Select = ({ options, defaultValue, onChange }) => {
  const selectStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      boxShadow: 'none',
      outline: 'none',
      padding: "8px",
      border: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      '&:hover': { borderBottom: '1px solid rgba(111, 90, 208, 0.4)' },
    }),
    option: ((styles, { isSelected, isFocused }) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.9)",
      backgroundColor: isSelected ? 'rgb(241, 241, 241)' : '#fff',
      '&:hover': { backgroundColor: isSelected ? 'rgb(241, 241, 241)' : 'rgba(111, 90, 208, 0.1)' }
    })),
    singleValue: (styles) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.9)",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: "rgba(0, 0, 0, 0.1)",
      '&:hover': { color: 'rgba(0, 0, 0, 0.1)' }
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
