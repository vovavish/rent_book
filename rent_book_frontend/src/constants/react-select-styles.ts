import { SingleValue } from "react-select/animated";

export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: '#f9fafb',
    '&:hover': {
      borderColor: '#ccc',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'rgb(174, 125, 172)'
      : state.isFocused
      ? '#f0ccee'
      : 'white',
    color: state.isSelected ? 'white' : 'rgb(51, 51, 51)',
    cursor: 'pointer',
    fontSize: 'clamp(0.75rem, 0.706rem + 0.1878vw, 0.875rem)',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'rgb(128, 128, 128)',
  }),
};