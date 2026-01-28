// import { useState, useEffect } from 'react';
// import { request } from '@/request';
// import useFetch from '@/hooks/useFetch';
// import { Select, Tag } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { generate as uniqueId } from 'shortid';
// import color from '@/utils/color';
// import useLanguage from '@/locale/useLanguage';

// const SelectAsync = ({
//   entity,
//   displayLabels = ['name'],
//   outputValue = '_id',
//   redirectLabel = '',
//   withRedirect = false,
//   urlToRedirect = '/',
//   placeholder = 'select',
//   value,
//   onChange,
// }) => {
//   const translate = useLanguage();
//   const [selectOptions, setOptions] = useState([]);
//   const [currentValue, setCurrentValue] = useState(undefined);

//   const navigate = useNavigate();

//   const asyncList = () => {
//     return request.list({ entity });
//   };
//   const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
//   useEffect(() => {
//     isSuccess && setOptions(result);
//   }, [isSuccess]);

//   const labels = (optionField) => {
//     return displayLabels.map((x) => optionField[x]).join(' ');
//   };
//   useEffect(() => {
//     if (value !== undefined) {
//       const val = value?.[outputValue] ?? value;
//       setCurrentValue(val);
//       onChange(val);
//     }
//   }, [value]);

//   const handleSelectChange = (newValue) => {
//     if (newValue === 'redirectURL') {
//       navigate(urlToRedirect);
//     } else {
//       const val = newValue?.[outputValue] ?? newValue;
//       setCurrentValue(newValue);
//       onChange(val);
//     }
//   };

//   const optionsList = () => {
//     const list = [];

//     // if (selectOptions.length === 0 && withRedirect) {
//     //   const value = 'redirectURL';
//     //   const label = `+ ${translate(redirectLabel)}`;
//     //   list.push({ value, label });
//     // }
//     selectOptions.map((optionField) => {
//       const value = optionField[outputValue] ?? optionField;
//       const label = labels(optionField);
//       const currentColor = optionField[outputValue]?.color ?? optionField?.color;
//       const labelColor = color.find((x) => x.color === currentColor);
//       list.push({ value, label, color: labelColor?.color });
//     });

//     return list;
//   };

//   return (
//     <Select
//       loading={fetchIsLoading}
//       disabled={fetchIsLoading}
//       value={currentValue}
//       onChange={handleSelectChange}
//       placeholder={placeholder}
//     >
//       {optionsList()?.map((option) => {
//         return (
//           <Select.Option key={`${uniqueId()}`} value={option.value}>
//             <p>
//               {option.label}
//             </p>
//           </Select.Option>
//         );
//       })}
//       {withRedirect && (
//         <Select.Option value={'redirectURL'}>{`+ ` + translate(redirectLabel)}</Select.Option>
//       )}
//     </Select>
//   );
// };

// export default SelectAsync;


import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';

const SelectAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'select',
  value,
  onChange,
}) => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const navigate = useNavigate();

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);

  useEffect(() => {
    if (isSuccess && result) {
      setOptions(result);
    }
  }, [isSuccess, result]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (value !== undefined) {
      const val = value?.[outputValue] ?? value;
      setCurrentValue(val);
    }
  }, [value]);

  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      navigate(urlToRedirect);
    } else {
      // Find the full object from selectOptions based on the selected value
      const selectedObject = selectOptions.find(
        (option) => option[outputValue] === newValue
      );
      setCurrentValue(newValue);
      // Pass the full object to onChange, or just the value if no object is found
      onChange(selectedObject || newValue);
    }
  };

  const optionsList = () => {
    const list = selectOptions.map((optionField) => {
      const value = optionField[outputValue] ?? optionField;
      const label = labels(optionField);
      const currentColor = optionField.color ?? color.find((x) => x.color === optionField.color)?.color;
      return { value, label, color: currentColor };
    });

    if (withRedirect) {
      list.push({
        value: 'redirectURL',
        label: `+ ${translate(redirectLabel)}`,
      });
    }

    return list;
  };

  return (
    <Select
      loading={fetchIsLoading}
      disabled={fetchIsLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={placeholder}
    >
      {optionsList()?.map((option) => (
        <Select.Option key={uniqueId()} value={option.value}>
          <p style={{ color: option.color }}>{option.label}</p>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectAsync;