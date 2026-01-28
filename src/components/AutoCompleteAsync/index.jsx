import { useState, useEffect, useRef } from 'react';
import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import useDebounce from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { Select, Empty } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function AutoCompleteAsync({
  entity,
  displayLabels,
  searchFields,
  outputValue = '_id',
  redirectLabel = 'Add New',
  withRedirect = false,
  urlToRedirect = '/',
  value,
  onChange,
  form,
  fieldName,
}) {
  const translate = useLanguage();
  const addNewValue = { value: 'redirectURL', label: `+ ${translate(redirectLabel)}` };
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const isUpdating = useRef(true);
  const isSearching = useRef(false);
  const [searching, setSearching] = useState(false);
  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const navigate = useNavigate();

  const handleSelectChange = (newValue, option) => {
    isUpdating.current = false;
    if (newValue) {
      if (form && fieldName !== undefined) {
        console.log("option", option);
        
        // Update related fields (hsCode, description, tax) when an item is selected
        form.setFieldsValue({
          [fieldName]: {
            hsCode: option?.category['HS Code'] || '',
            description: option['description'] || '',
            tax: option?.category?.tax || 0,
          },
        });
      }
      if (onChange) {
        onChange(newValue[outputValue] || newValue);
      }
    } else {
      console.log('Item Cleared'); // Log when the selection is cleared
      if (form && fieldName !== undefined) {
        // Clear related fields when item is unselected
        form.setFieldsValue({
          [fieldName]: {
            hsCode: '',
            description: '',
            tax: 0,
          },
        });
      }
      if (onChange) {
        onChange(null);
      }
    }
    if (newValue === 'redirectURL' && withRedirect) {
      navigate(urlToRedirect);
    }
  };

  const handleOnSelect = (value, option) => {
    setCurrentValue(value[outputValue] || value); // Set nested value or value
    console.log('On Select Item:', option); // Log the selected item on select
  };

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const asyncSearch = async (options) => {
    return await request.search({ entity, options });
  };

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    const options = {
      q: debouncedValue,
      fields: searchFields,
    };
    const callback = asyncSearch(options);
    onFetch(callback);

    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText) => {
    isSearching.current = true;
    setSearching(true);
    setValToSearch(searchText);
  };

  useEffect(() => {
    if (isSuccess) {
      setOptions(result);
    } else {
      setSearching(false);
    }
  }, [isSuccess, result]);

  useEffect(() => {
    if (value && isUpdating.current) {
      setOptions([value]);
      setCurrentValue(value[outputValue] || value);
      if (onChange) {
        onChange(value[outputValue] || value);
      }
      if (form && fieldName !== undefined) {
        form.setFieldsValue({
          [fieldName]: {
            hsCode: value?.category?.['HS Code'] || '',
            description: value?.['description'] || '',
            tax: value?.category?.tax || 0,
          },
        });
      }
      isUpdating.current = false;
    }
  }, [value, form, fieldName]);

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={translate('Search')}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      onClear={() => {
        setSearching(false);
      }}
      onChange={handleSelectChange}
      onSelect={handleOnSelect}
      style={{ minWidth: '220px' }}
    >
      {selectOptions.map((optionField) => (
        <Select.Option
          key={optionField[outputValue] || optionField}
          value={optionField[outputValue] || optionField}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
      {withRedirect && <Select.Option value={addNewValue.value}>{addNewValue.label}</Select.Option>}
    </Select>
  );
}