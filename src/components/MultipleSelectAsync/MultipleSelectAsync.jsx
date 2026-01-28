import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';

const MultipleSelectAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'Select options',
  value,
  onChange,
  maxTagCount = 'responsive',
}) => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState([]);

  const navigate = useNavigate();

  const asyncList = () => {
    let options = {page:1, items:100};
    return request.list({ entity, options });
  };
  
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  
  useEffect(() => {
    isSuccess && setOptions(result);
  }, [isSuccess]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (value !== undefined) {
      // Handle array of values for multiple mode
      const val = Array.isArray(value) 
        ? value.map(item => item?.[outputValue] ?? item)
        : [];
      setCurrentValue(val);
    }
  }, [value]);

  const handleSelectChange = (newValue) => {
    if (newValue && newValue.includes('redirectURL')) {
      // Remove redirectURL from selection and navigate
      const filteredValue = newValue.filter(val => val !== 'redirectURL');
      setCurrentValue(filteredValue);
      onChange(filteredValue);
      navigate(urlToRedirect);
    } else {
      setCurrentValue(newValue || []);
      onChange(newValue || []);
    }
  };

  const optionsList = () => {
    const list = [];

    selectOptions.map((optionField) => {
      const value = optionField[outputValue] ?? optionField;
      const label = labels(optionField);
      const currentColor = optionField[outputValue]?.color ?? optionField?.color;
      const labelColor = color.find((x) => x.color === currentColor);
      list.push({ value, label, color: labelColor?.color });
    });

    return list;
  };

  // Function to render selected tags
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    
    return (
      <Tag
        color="blue"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, marginBottom: 3 }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Select
      loading={fetchIsLoading}
      disabled={fetchIsLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={placeholder}
      mode="multiple"
      tagRender={tagRender}
      style={{ width: '100%' }}
      allowClear
      maxTagCount={maxTagCount}
    >
      {optionsList()?.map((option) => {
        return (
          <Select.Option key={`${uniqueId()}`} value={option.value}>
            {option.label}
          </Select.Option>
        );
      })}
      
      {withRedirect && (
        <Select.Option value={'redirectURL'}>
          {`+ ` + translate(redirectLabel)}
        </Select.Option>
      )}
    </Select>
  );
};

export default MultipleSelectAsync;