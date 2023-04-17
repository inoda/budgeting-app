import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const CurrencyField = ({ onChange, onBlur, initialValue, className }) => {
  const handleChange = (e) => {
    if (!onChange) { return; }
    const num = e.target.value.replace(/\$|,/g, '');
    const cents = parseInt(parseFloat(num).toFixed(2).replace(/\./g, ''));
    const normalized = isNaN(cents) ? 0 : cents;
    onChange(normalized);
  }

  const handleBlur = (e) => {
    if (!onBlur) { return; }
    const num = e.target.value.replace(/\$|,/g, '');
    const cents = parseInt(parseFloat(num).toFixed(2).replace(/\./g, ''));
    const normalized = isNaN(cents) ? 0 : cents;
    onBlur(normalized);
  }

  const defaultMaskOptions = {
    prefix: '$',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 7,
    allowLeadingZeroes: false,
    allowNegative: true,
  };
  const currencyMask = createNumberMask(defaultMaskOptions);

  return (
    <MaskedInput
      placeholder="$0.00"
      inputMode="decimal"
      mask={currencyMask}
      onBlur={handleBlur}
      onChange={handleChange}
      defaultValue={initialValue ? (initialValue / 100).toFixed(2) : ''}
      className={className}
    />
  );
}

export default CurrencyField;
