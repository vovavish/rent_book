export const customStyles = {
  // @ts-ignore no-explicit-any
  control: (provided: any) => ({
    ...provided,
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: 'var(--input-bg-sm-accent-color)',
    color: 'var(--text-color)',
    '&:hover': {
      borderColor: '#ccc',
    },
  }),
  // @ts-ignore no-explicit-any
  placeholder: (provided: any) => ({
    ...provided,
    color: 'var(--text-color)', // или любая другая переменная
  }),
  // @ts-ignore no-explicit-any
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
  // @ts-ignore no-explicit-any
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--text-color)',
  }),
  // @ts-ignore no-explicit-any
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--card-bg-color-accent)',
  }),
  // @ts-ignore no-explicit-any
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'var(--text-color)',
  }),
};