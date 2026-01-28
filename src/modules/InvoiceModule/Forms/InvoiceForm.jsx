import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, Table, Tooltip, Spin, message, Switch } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import useLanguage from '@/locale/useLanguage';
import calculate from '@/utils/calculate';
import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';
import { API_BASE_URL } from '@/config/serverApiConfig';
import axios from 'axios';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

export default function InvoiceForm({ subTotal = 0, offerTotal = 0, current = null, form, onFinish, onValuesChange }) {
  const translate = useLanguage();
  const { last_invoice_number } = useSelector(selectFinanceSettings);
  const [total, setTotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [lastNumber, setLastNumber] = useState(() => last_invoice_number + 1);
  const [items, setItems] = useState([]);
  const [hsCodes, setHsCodesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleTypeData, setSaleTypeData] = useState([]);
  const [hSLoading, setHSLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [rateLoading, setRateLoading] = useState(false);
  const [provinceLoading, setProvinceLoading] = useState(true);
  const [saleTypeLoading, setSaleTypeLoading] = useState(true);
  const [uomOptions, setUomOptions] = useState([]);
  const [rateOptions, setrateOptions] = useState([]);
  const [sroOptions, setSroOptions] = useState([]);
  const [uomLoading, setUomLoading] = useState(false);
  const [itemNoOptions, setItemNoOptions] = useState([]);
  const [provinceData, setProviceData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [clientLoading, setClientLoading] = useState(true);
  const [itemNoLoading, setItemNoLoading] = useState(false);
  const [sroLoading, setSroLoading] = useState(false);
  const [isFetchingRegistration, setIsFetchingRegistration] = useState(false);
  const [isItemFormDisabled, setIsItemFormDisabled] = useState(true);
  const itemForm = Form.useForm()[0];
  const authData = storePersist.get("auth");
  const [fbrsubmit, setFbrsubmit] = useState(false);

  const currentAdmin = useSelector(selectCurrentAdmin);

  const requiredBuyerSellerFields = [
    'invoiceType',
  ];


  const handleToggle = (checked) => {
    setFbrsubmit(checked);
  };

  useEffect(() => {
    if (authData?.current && form) {
      const currentValues = form.getFieldsValue(['sellerBusinessName', 'sellerProvince', 'sellerNTNCNIC', 'sellerAddress']);

      form.setFieldsValue({
        sellerBusinessName: currentValues.sellerBusinessName || authData.current.name || '',
        sellerProvince: currentValues.sellerProvince || authData.current.province || '',
        sellerNTNCNIC: currentValues.sellerNTNCNIC || authData.current.ntn || '',
        sellerAddress: currentValues.sellerAddress || authData.current.address || '',
      });
    }
  }, [authData]);

  useEffect(() => {
    const fetchInvoiceFields = async () => {
      const apis = [
        { url: `${API_BASE_URL}client/listAll`, setter: setClientData, loadingSetter: setClientLoading },
        { url: `${API_BASE_URL}user-fbr/provinces`, setter: setProviceData, loadingSetter: setProvinceLoading },
        { url: `${API_BASE_URL}user-fbr/hscode`, setter: setHsCodesData, loadingSetter: setHSLoading },
        { url: `${API_BASE_URL}product/listAll`, setter: setProducts, loadingSetter: setProductLoading },
        { url: `${API_BASE_URL}user-fbr/saletype`, setter: setSaleTypeData, loadingSetter: setSaleTypeLoading },
      ];

      const promises = apis.map(async (api) => {
        api.loadingSetter(true);
        try {
          const response = await axios.get(api.url, {
            headers: { Authorization: `Bearer ${authData?.current?.token}` },
          });
          if (response.data.success) {
            api.setter(response.data.result);
          }
          return { response };
        } catch (error) {
          console.error(`Error fetching ${api.url}`, error);
          return { error };
        } finally {
          api.loadingSetter(false);
        }
      });

      await Promise.all(promises);
    };

    fetchInvoiceFields();
  }, []);


  useEffect(() => {

    if (!form) {
      console.warn('Form is undefined in InvoiceForm useEffect. Check parent component.');
      return;
    }
    if (current && saleTypeData.length > 0) {
      const {
        taxRate = 0,
        year,
        number,
        items: currentItems = [],
        invoiceDate,
        invoiceType,
        invoiceRefNo,
        scenarioId,
        sellerBusinessName,
        sellerProvince,
        sellerNTNCNIC,
        sellerAddress,
        buyerBusinessName,
        buyerProvince,
        buyerNTNCNIC,
        buyerAddress,
        buyerRegistrationType,
        fbrsubmit = false,
        FbrInvoiceNo,
      } = current;



      let storedSaleType = current.items[0].saleType;
      let saleTypeId;
      if (typeof storedSaleType === 'string') {
        const found = saleTypeData.find(item => item.transactioN_DESC === storedSaleType);
        saleTypeId = found ? found.transactioN_TYPE_ID : null;
      }


      console.log(saleTypeId);

      setCurrentYear(year);
      setLastNumber(number);
      setItems(currentItems);
      setFbrsubmit(fbrsubmit);

      form.setFieldsValue({
        invoiceDate: invoiceDate ? dayjs(invoiceDate) : null,
        invoiceType,
        invoiceRefNo,
        scenarioId,
        sellerBusinessName,
        sellerProvince,
        sellerNTNCNIC,
        sellerAddress,
        buyerBusinessName,
        buyerProvince,
        buyerNTNCNIC,
        buyerAddress,
        buyerRegistrationType,
        saleType: saleTypeId,
        fbrsubmit,
        FbrInvoiceNo,
        items: currentItems,
      });

      if (saleTypeId !== null) {
        handleDynamicChange({
          value: saleTypeId,
          fieldKey: "rate",
          optionsDataSet: setrateOptions,
          optionLoading: setRateLoading,
          api_route: "user-fbr/saletypeByRate",
          api_route_params_key: "saletype",
          field_value: "ratE_ID",
          field_label: "ratE_DESC",
        });
      }
    }
  }, [current, form, saleTypeData]);


  useEffect(() => {
    const newTaxTotal = items.reduce((sum, item) => calculate.add(sum, item.salesTaxApplicable || 0), 0);
    const newSubTotal = items.reduce((sum, item) => calculate.add(sum, item.valueSalesExcludingST || 0), 0);
    const newTotal = calculate.add(newSubTotal, newTaxTotal);
    setTaxTotal(newTaxTotal);
    setTotal(newTotal);
  }, [items]);

  const handleDynamicChange = async ({
    value,
    fieldKey,
    optionsDataSet,
    optionLoading,
    api_route,
    api_route_params_key,
    field_value,
    field_label
  }) => {
    itemForm.setFieldsValue({ [fieldKey]: undefined });

    optionsDataSet([]);
    optionLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}${api_route}?${api_route_params_key}=${String(value).replace('%', '') ?? value}`,
        {
          headers: {
            Authorization: `Bearer ${authData?.current?.token}`,
          },
        }
      );

      if (response.data.success) {
        const mappedOptions = response.data.result.map(item => ({
          value: item[field_value],
          label: item[field_label],
        }));
        optionsDataSet(mappedOptions);
      }
    } catch (error) {
      console.error(`Error fetching ${api_route}:`, error);
    } finally {
      optionLoading(false);
    }
  };



  const handleClient = (value) => {
    const selectedClient = clientData.find(client => client.name === value);
    if (selectedClient) {
      form.setFieldsValue({
        buyerProvince: selectedClient?.province?.toUpperCase() || '',
        buyerNTNCNIC: selectedClient['NTN#'] || '',
        buyerAddress: selectedClient.address || selectedClient['Test Address'] || '',
      });
    } else {
      form.setFieldsValue({
        buyerProvince: '',
        buyerNTNCNIC: '',
        buyerAddress: '',
      });
    }
  };

  const handleSaveItem = async () => {
    try {
      const values = await itemForm.validateFields();

      const rateDesc = rateOptions?.find(opt => opt.value === values.rate)?.label || values.rate;
      const sroLabel = sroOptions?.find(opt => opt.value === values.sroScheduleNo)?.label || values.sroScheduleNo;

      const rateNum = parseFloat(rateDesc) / 100;
      const valueSalesExcludingST = calculate.multiply(values.quantity || 0, values.unitPrice || 0) - (values.discount || 0);
      const salesTaxApplicable = Number.parseFloat(calculate.multiply(valueSalesExcludingST, rateNum));

      const valueSalesIncludingST = calculate.add(valueSalesExcludingST, salesTaxApplicable);

      const saleTypeDesc = saleTypeData.find(item => item.transactioN_TYPE_ID === Number(form.getFieldValue('saleType')))?.transactioN_DESC || '';

      const selectedProduct = products.find(p => p._id === values.productDescription);
      const productName = selectedProduct ? selectedProduct["Product Name"] : '';
      const productHS_Code = selectedProduct?.category?.["HS Code"] || values.hsCode;
      const productUOM = selectedProduct?.uom || values.uoM;

      const newItem = {
        hsCode: productHS_Code,
        productId: values.productDescription,
        productDescription: productName,
        unitPrice: values.unitPrice,
        rate: rateDesc,
        uoM: productUOM,
        quantity: values.quantity,
        valueSalesExcludingST: Number.parseFloat(valueSalesExcludingST),
        salesTax: salesTaxApplicable,
        valueSalesIncludingST: Number.parseFloat(valueSalesIncludingST),
        fixedNotifiedValueOrRetailPrice: values.fixedNotifiedValueOrRetailPrice || 0,
        salesTaxApplicable: salesTaxApplicable,
        salesTaxWithheldAtSource: values.salesTaxWithheldAtSource || 0,
        extraTax: values.extraTax || 0,
        furtherTax: values.furtherTax || 0,
        sroScheduleNo: sroLabel || '',
        sroItemSerialNo: values.sroItemSerialNo || '',
        fedPayable: values.fedPayable || 0,
        discount: values.discount || 0,
        totalValues: Number.parseFloat(valueSalesIncludingST),
        saleType: saleTypeDesc,
      };

      const currentItems = form.getFieldValue('items') || [];
      const updatedItems = [...currentItems, newItem];
      form.setFieldsValue({ items: updatedItems });
      setItems(updatedItems);
      itemForm.resetFields();
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  // const handleSaveItem = async () => {
  //   try {
  //     const values = await itemForm.validateFields();

  //     // New: Get the rate description from rateOptions
  //     const rateDesc = rateOptions?.find(opt => opt.value === values.rate)?.label || values.rate; // Fallback to ID if not found
  //     const sroLabel = sroOptions?.find(opt => opt.value === values.sroScheduleNo)?.label || values.sroScheduleNo; // Fallback to ID if not found

  //     const rateNum = parseFloat(rateDesc) / 100; // Updated: Parse from description (handles "18%" -> 18)
  //     const salesTaxApplicable = Number.parseFloat(calculate.multiply(values.valueSalesExcludingST || 0, rateNum));
  //     const saleTypeDesc = saleTypeData.find(item => item.transactioN_TYPE_ID === Number(form.getFieldValue('saleType')))?.transactioN_DESC || '';

  //     const newItem = {
  //       hsCode: values.hsCode,
  //       productDescription: values.productDescription,
  //       rate: rateDesc, // Updated: Store description instead of ID
  //       uoM: values.uoM,
  //       quantity: values.quantity,
  //       valueSalesExcludingST: values.valueSalesExcludingST,
  //       fixedNotifiedValueOrRetailPrice: values.fixedNotifiedValueOrRetailPrice || 0,
  //       salesTaxApplicable: salesTaxApplicable,
  //       salesTaxWithheldAtSource: values.salesTaxWithheldAtSource || 0,
  //       extraTax: values.extraTax || 0,
  //       furtherTax: values.furtherTax || 0,
  //       sroScheduleNo: sroLabel || '',
  //       sroItemSerialNo: values.sroItemSerialNo || '',
  //       fedPayable: values.fedPayable || 0,
  //       discount: values.discount || 0,
  //       totalValues: values.totalValues || 0,
  //       saleType: saleTypeDesc,
  //     };
  //     const currentItems = form.getFieldValue('items') || [];
  //     const updatedItems = [...currentItems, newItem];
  //     form.setFieldsValue({ items: updatedItems });
  //     setItems(updatedItems);
  //     itemForm.resetFields();
  //   } catch (error) {
  //     console.error('Validation Failed:', error);
  //   }
  // };

  const checkBuyerSellerComplete = (allValues) => {
    return requiredBuyerSellerFields.every(field => {
      const val = allValues[field];
      if (field === 'invoiceDate') {
        return val && dayjs.isDayjs(val) && val.isValid();
      }
      return !!val;
    });
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    setItems(allValues.items || []);
    const isComplete = checkBuyerSellerComplete(allValues);
    setIsItemFormDisabled(!isComplete);
  };

  const removeItem = (index) => {
    const currentItems = form.getFieldValue('items') || [];
    currentItems.splice(index, 1);
    form.setFieldsValue({ items: currentItems });
    setItems(currentItems);
  };

  const buyerRegistrationTypeOptions = [
    { value: 'Registered', label: 'Registered' },
    { value: 'Unregistered', label: 'Unregistered' },
    { value: 'Unregistered Distirbutor', label: 'Unregistered Distirbutor' },
    { value: 'Retail Consumer', label: 'Retail Consumer' },
  ];

  const InvoiceTypesOptions = [
    { value: 'Sale Invoice', label: 'Sale Invoice' },
    { value: 'Debit Note', label: 'Debit Note' },
  ];

  const columns = [
    { title: 'Sr. No.', render: (text, record, index) => index + 1, width: 80 },
    {
      title: 'Action',
      render: (text, record, index) => <DeleteOutlined onClick={() => removeItem(index)} style={{ cursor: 'pointer' }} />,
      width: 80,
    },
    { title: 'HS Code', dataIndex: 'hsCode', width: 120 },
    { title: 'Product Description', dataIndex: 'productDescription', width: 150 },
    { title: 'Sale Type', dataIndex: 'saleType', width: 150 },
    { title: 'Rate', dataIndex: 'rate', width: 100 },
    { title: 'UOM', dataIndex: 'uoM', width: 150 },
    { title: 'Quantity', dataIndex: 'quantity', width: 100 },
    { title: 'Unit Price', dataIndex: 'unitPrice', width: 100 },
    { title: 'Value of Sales Excl. ST', dataIndex: 'valueSalesExcludingST', width: 150 },
    { title: 'Value of Sales Incl. ST', dataIndex: 'valueSalesIncludingST', width: 150 },
    { title: 'Sales Tax', dataIndex: 'salesTax', width: 100 },
    { title: 'ST Withheld at Source', dataIndex: 'salesTaxWithheldAtSource', width: 150 },
    { title: 'Extra Tax', dataIndex: 'extraTax', width: 100 },
    { title: 'Further Tax', dataIndex: 'furtherTax', width: 100 },
    { title: 'Fixed/Notified Value or Retail Price', dataIndex: 'fixedNotifiedValueOrRetailPrice', width: 200 },
    { title: 'SRO/Schedule No.', dataIndex: 'sroScheduleNo', width: 150 },
    { title: 'Item Sr. No.', dataIndex: 'sroItemSerialNo', width: 100 },
    { title: 'Total Values', dataIndex: 'totalValues', width: 100 },
    { title: 'FED Payable', dataIndex: 'fedPayable', width: 100 },
    { title: 'Discount', dataIndex: 'discount', width: 100 },
  ];

  const handleEnterPress = async (e) => {
    e.preventDefault();
    try {
      await form.validateFields(['buyerNTNCNIC']);
      const buyerNTNCNIC = form.getFieldValue('buyerNTNCNIC') || e.target.value;

      if (!buyerNTNCNIC) {
        message.error(translate('Please enter a valid NTN/CNIC'), 10);
        return;
      }

      setIsFetchingRegistration(true);
      try {
        const response = await axios.get(`${API_BASE_URL}user-fbr/regType?reg_no=${buyerNTNCNIC}`, {
          headers: { Authorization: `Bearer ${authData?.current?.token}` },
        });

        if (response.data.success && response.data.result) {
          const registrationType = response.data.result.REGISTRATION_TYPE?.toLowerCase() || '';
          form.setFieldsValue({ buyerRegistrationType: registrationType });
          message.success(translate(`Buyer Registration Type set to: ${registrationType}`), 10);
        } else {
          message.warning(translate('No registration type found for this NTN/CNIC'), 10);
        }
      } catch (error) {
        console.error('Error fetching Buyer Registration Type:', error);
        message.error(translate('Failed to fetch Buyer Registration Type'), 10);
      } finally {
        setIsFetchingRegistration(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error(translate('Please enter a valid NTN/CNIC'), 10);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const { saleType, ...restValues } = values;

      const fbrItems = items.map(({ productId, productDescription, ...rest }) => ({
        ...rest,
        item: productId,
      }));

      const clientId = clientData?.find(opt => opt.name === values.buyerBusinessName)?._id || values.buyerBusinessName;
      let modifiedValues = {
        ...values,
        buyerBusinessName: clientId,
        invoiceDate: values.invoiceDate ? dayjs(values.invoiceDate).format('YYYY-MM-DD') : null,
        items: fbrItems,
        fbrsubmit: fbrsubmit, // Include fbrsubmit in modifiedValues for onFinish
      };

      console.log('fbrsubmit state:', fbrsubmit);
      console.log('usamam');

      if (fbrsubmit) {
        const payload = {
          ...restValues,
          invoiceDate: values.invoiceDate ? dayjs(values.invoiceDate).format('YYYY-MM-DD') : null,
          items: items.map(({ productId, ...rest }) => rest), // Exclude productId for FBR API
        };
        console.log('FBR API payload:', payload);

        const response = await axios.post(
          `${API_BASE_URL}user-fbr/digital_invoice`,
          payload,
          {
            headers: { Authorization: `Bearer ${authData?.current?.token}` },
          }
        );

        if (response.data.success && response.data.result.validationResponse.status === "Valid") {
          console.log('FBR Invoice Number:', response.data.result.invoiceNumber);
          message.success(translate("Invoice successfully submitted to FBR!"), 10);
          modifiedValues = {
            ...modifiedValues,
            FbrInvoiceNo: response.data.result.invoiceNumber, // Add FBR invoice number
          };
          console.log('modifiedValues (FBR submission):', modifiedValues);
          onFinish(modifiedValues); // Call onFinish with modified values
        } else {
          const errorMessage =
            response.data.result.validationResponse.error ||
            response.data.result.validationResponse.invoiceStatuses?.[0]?.error ||
            response.data.message ||
            "Unknown error";
          message.error(translate("Failed to submit invoice to FBR: " + errorMessage), 10);
        }
      } else {
        console.log("else ke anadar gaya");
        modifiedValues = {
          ...modifiedValues,
          FbrInvoiceNo: '', // Set FbrInvoiceNo to empty string
          fbrsubmit: false, // Ensure fbrsubmit is explicitly set to false
        };
        console.log('modifiedValues (no FBR submission):', modifiedValues);
        message.success(translate("Invoice saved without FBR submission!"), 10);
        onFinish(modifiedValues); // Call onFinish with modified values
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
      message.error(translate('Failed to process invoice due to a network or server error'), 10);
    }
  };

  // const handleFormSubmit = async (values) => {
  //   try {
  //     const { saleType, ...restValues } = values;
  //     // Prepare the payload for the API
  //     const payload = {
  //       ...restValues,
  //       invoiceDate: values.invoiceDate ? dayjs(values.invoiceDate).format('YYYY-MM-DD') : null,
  //       items: items,
  //       // total: total,
  //       // taxTotal: taxTotal,
  //     };

  //     // Call the original onFinish handler

  //     // Make the POST API call to submit the digital invoice
  //     const response = await axios.post(
  //       `${API_BASE_URL}user-fbr/digital_invoice`,
  //       payload,
  //       {
  //         headers: { Authorization: `Bearer ${authData?.current?.token}` },
  //       }
  //     );
  //     if (response.data.success && response.data.result.validationResponse.status == "Valid") {
  //       message.success(translate("Invoice successfully submitted!"), 10);
  //       const clientId = clientData?.find(opt => opt.name === values.buyerBusinessName)?._id || values.buyerBusinessName; // Fallback to ID if not found
  //       values.buyerBusinessName = clientId;
  //       onFinish(values);

  //     } else {
  //       const errorMessage =
  //         response.data.result.validationResponse.error ||
  //         response.data.result.validationResponse.invoiceStatuses?.[0]?.error ||
  //         response.data.message ||
  //         "Unknown error";
  //       message.error(translate("Failed to submit invoice: " + errorMessage), 10);
  //     }

  //   } catch (error) {
  //     console.error('Error submitting invoice:', error);
  //     message.error(translate('Failed to submit invoice due to a network or server error'), 10);
  //   }
  // };


  const calculateItemValues = async (formInstance) => {
    try {
      // Add 'discount' to the fields being validated
      const values = await formInstance.validateFields(['quantity', 'unitPrice', 'rate', 'discount']);

      const quantity = values.quantity || 0;
      const unitPrice = values.unitPrice || 0;
      const discount = values.discount || 0; // Get discount value

      // Calculate value excluding ST (with discount applied)
      const grossAmount = calculate.multiply(quantity, unitPrice);
      const valueSalesExcludingST = grossAmount - discount;

      // Calculate sales tax
      const rateDesc = rateOptions?.find(opt => opt.value === values.rate)?.label || '0%';
      const rateNum = parseFloat(rateDesc) / 100;
      const salesTaxApplicable = Number.parseFloat(calculate.multiply(valueSalesExcludingST, rateNum));

      // Calculate value including ST
      const valueSalesIncludingST = calculate.add(valueSalesExcludingST, salesTaxApplicable);

      // Update form fields
      formInstance.setFieldsValue({
        valueSalesExcludingST: Number.parseFloat(valueSalesExcludingST),
        salesTax: salesTaxApplicable,
        valueSalesIncludingST: Number.parseFloat(valueSalesIncludingST),
        totalValues: Number.parseFloat(valueSalesIncludingST),
      });

    } catch (error) {
      // Validation might fail if fields are empty, that's okay
      formInstance.setFieldsValue({
        valueSalesExcludingST: 0,
        salesTax: 0,
        valueSalesIncludingST: 0,
        totalValues: 0,
      });
    }
  };



  const handleProductChange = (productId) => {
    itemForm.setFieldsValue({
      hsCode: undefined,
      uoM: undefined,
      unitPrice: undefined,
    });

    if (!productId) return;

    const selectedProduct = products.find(p => p._id === productId);

    if (selectedProduct && selectedProduct.category) {
      const hsCode = selectedProduct.category["HS Code"];

      itemForm.setFieldsValue({
        hsCode: hsCode,
        unitPrice: selectedProduct.price || 0, // Auto-fill unit price if available
      });

      if (hsCode) {
        handleDynamicChange({
          value: hsCode,
          fieldKey: "uoM",
          optionsDataSet: setUomOptions,
          optionLoading: setUomLoading,
          api_route: "user-fbr/uombyhscode",
          api_route_params_key: "hs_code",
          field_value: "description",
          field_label: "description",
        });
      }

      if (selectedProduct.uom) {
        itemForm.setFieldsValue({
          uoM: selectedProduct.uom,
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormValuesChange}
        onFinish={handleFormSubmit}
        className="space-y-6"
      >
        <Divider className="bg-teal-600 text-white font-bold text-lg py-2 rounded">
          {translate('Buyer Seller Detail')}
        </Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="invoiceDate"
              label={translate('Invoice Date')}
              rules={[{ required: true, type: 'object', message: 'Please select a valid date' }]}
              initialValue={dayjs()}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="invoiceType" label={translate('Invoice Type')} rules={[{ required: true }]}>
              <Select placeholder="Select Invoice Type" options={InvoiceTypesOptions} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="invoiceRefNo" label={translate('Invoice Ref No.')}>
              <Input placeholder="Enter Invoice Ref No" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="scenarioId" label={translate('Scenario ID')} initialValue={undefined}>
              <Select
                placeholder="Select Scenario ID"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                className="w-full"
              >
                {currentAdmin?.scenarioIds?.map((item) => (
                  <Select.Option key={item.scenarioId} value={item.scenarioId}>
                    {item.scenarioId} - {item.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="sellerBusinessName" label={translate('Seller Business Name')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="sellerProvince" label={translate('Seller Province')} rules={[{ required: true }]}>
              <Select
                placeholder="Select Seller Province"
                loading={provinceLoading}
                showSearch
                optionFilterProp="children"
                className="w-full"
              >
                {provinceData?.map((item) => (
                  <Select.Option key={item.stateProvinceDesc} value={item.stateProvinceDesc}>
                    {item.stateProvinceDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="sellerNTNCNIC" label={translate('Seller NTN/CNIC')} rules={[{ required: true }]}>
              <Input placeholder="Enter Seller NTN/CNIC" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="sellerAddress" label={translate('Seller Address')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="buyerBusinessName" label={translate('Buyer Business Name')} rules={[{ required: true }]}>
              <Select
                placeholder="Select Buyer Business Name"
                loading={clientLoading}
                showSearch
                disabled={provinceLoading}
                optionFilterProp="children"
                onChange={handleClient}
                className="w-full"
              >
                {clientData?.map((item) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="buyerProvince" label={translate('Buyer Province')} rules={[{ required: true }]}>
              <Select
                placeholder="Select Buyer Province"
                loading={provinceLoading}
                showSearch
                optionFilterProp="children"
                className="w-full"
              >
                {provinceData?.map((item) => (
                  <Select.Option key={item.stateProvinceDesc} value={item.stateProvinceDesc}>
                    {item.stateProvinceDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            {/* <Form.Item name="buyerNTNCNIC" label={translate('Buyer NTN/CNIC')}>
              <Tooltip title="Please enter NTN/CNIC then press Enter to get Buyer Registration Type">
                <Input
                  value={form.getFieldValue('buyerNTNCNIC')}
                  onChange={(e) => form.setFieldsValue({ buyerNTNCNIC: String(e.target.value) })}
                  placeholder={translate('Enter Buyer NTN/CNIC')}
                  onPressEnter={handleEnterPress}
                  disabled={isFetchingRegistration}
                  suffix={isFetchingRegistration ? <Spin size="small" /> : null}
                />
              </Tooltip>
            </Form.Item> */}

            <Tooltip title="Please enter NTN/CNIC then press Enter to get Buyer Registration Type">
              <Form.Item
                name="buyerNTNCNIC"
                label={translate('Buyer NTN/CNIC')}
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={translate('Enter Buyer NTN/CNIC')}
                  onPressEnter={handleEnterPress}
                  disabled={isFetchingRegistration}
                  suffix={isFetchingRegistration ? <Spin size="small" /> : null}
                />
              </Form.Item>
            </Tooltip>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="buyerAddress" label={translate('Buyer Address')} rules={[{ required: true }]}>
              <Input placeholder="Enter Buyer Address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="buyerRegistrationType" label={translate('Buyer Registration Type')} rules={[{ required: true }]}>
              <Select placeholder="Select Buyer Registration Type" options={buyerRegistrationTypeOptions} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="saleType"
              label={translate('Sale Type')}
              rules={[{ required: true, message: "Please select Sale Type" }]}
            >
              <Select
                placeholder="Select Sale Type"
                loading={saleTypeLoading}
                showSearch
                optionFilterProp="children"
                onChange={(value) =>
                  handleDynamicChange({
                    value,
                    fieldKey: "rate",
                    optionsDataSet: setrateOptions,
                    optionLoading: setRateLoading,
                    api_route: "user-fbr/saletypeByRate",
                    api_route_params_key: "saletype",
                    field_value: "ratE_ID",
                    field_label: "ratE_DESC",
                  })
                }
                className="w-full"
              >
                {saleTypeData?.map((item) => (
                  <Select.Option key={item.transactioN_TYPE_ID} value={item.transactioN_TYPE_ID}>
                    {item.transactioN_DESC}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="fbrsubmit"
              label={translate('FBR Submit')} // Adjust label as needed
              valuePropName="checked" // Required for Switch to work with Form
            >
              <Switch
                checked={fbrsubmit}
                onChange={handleToggle}
                checkedChildren="Submit"
                unCheckedChildren="Not Sumbit"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider className="bg-teal-600 text-white font-bold text-lg py-2 rounded">
          {translate('Item Detail')}
        </Divider>

        <Form form={itemForm} layout="vertical" disabled={isItemFormDisabled}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="productDescription" label={translate('Product')} rules={[{ required: true }]}>
                <Select
                  placeholder="Select Product"
                  loading={productLoading}
                  showSearch
                  optionFilterProp="children"
                  onChange={handleProductChange} // Add this onChange handler
                  className="w-full"
                >
                  {products?.map((item) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item["Product Name"]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="hsCode"
                label={translate('HS Code')}
                rules={[{ required: true, message: "Please select HS Code" }]}
              >
                <Select
                  placeholder="Select HS Code"
                  loading={hSLoading}
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) =>
                    handleDynamicChange({
                      value,
                      fieldKey: "uoM",
                      optionsDataSet: setUomOptions,
                      optionLoading: setUomLoading,
                      api_route: "user-fbr/uombyhscode",
                      api_route_params_key: "hs_code",
                      field_value: "description",
                      field_label: "description",
                    })
                  }
                  className="w-full"
                >
                  {hsCodes?.map((item) => (
                    <Select.Option key={item.hS_CODE} value={item.hS_CODE}>
                      {`${item.hS_CODE} - ${item.description}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name="rate" label={translate('Rate')} rules={[{ required: true, message: "Please select Rate" }]}>
                <Select
                  onChange={(value) => {
                    handleDynamicChange({
                      value,
                      fieldKey: "sroScheduleNo",
                      optionsDataSet: setSroOptions,
                      optionLoading: setSroLoading,
                      api_route: "user-fbr/sroScheduleByRate",
                      api_route_params_key: "rate_id",
                      field_value: "srO_ID",
                      field_label: "srO_DESC",
                    });
                    calculateItemValues(itemForm);
                  }}
                  loading={rateLoading}
                  options={rateOptions}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="uoM" label={translate('UOM')} rules={[{ required: true }]}>
                <Select loading={uomLoading} options={uomOptions} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="quantity" label={translate('Quantity')} rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  className="w-full"
                  onChange={(value) => calculateItemValues(itemForm)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="unitPrice" label={translate('Unit Price')} rules={[{ required: true }]}>
                <InputNumber
                  min={0}
                  className="w-full"
                  onChange={(value) => calculateItemValues(itemForm)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="discount" label={translate('Discount')}>
                <InputNumber min={0} onChange={(value) => calculateItemValues(itemForm)}
                  className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="valueSalesExcludingST" label={translate('Invoice Value before ST')}>
                <InputNumber min={0} className="w-full" readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="salesTax" label={translate('Sales Tax')}>
                <InputNumber min={0} className="w-full" readOnly />
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={12} md={6}>
  <Form.Item name="valueSalesIncludingST" label={translate('Value of Sales Incl. ST')}>
    <InputNumber min={0} className="w-full" readOnly />
  </Form.Item>
</Col> */}


            <Col xs={24} sm={12} md={6}>
              <Form.Item name="fixedNotifiedValueOrRetailPrice" label={translate('Fixed/Notified Value or Retail Price')}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="salesTaxWithheldAtSource" label={translate('ST Withheld at Source')}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="extraTax" label={translate('Extra Tax')}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="furtherTax" label={translate('Further Tax')}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="sroScheduleNo" label={translate('SRO/Schedule No')}>
                <Select
                  onChange={(value) =>
                    handleDynamicChange({
                      value,
                      fieldKey: "sroItemSerialNo",
                      optionsDataSet: setItemNoOptions,
                      optionLoading: setItemNoLoading,
                      api_route: "user-fbr/sroitem",
                      api_route_params_key: "sro_id",
                      field_value: "srO_ITEM_DESC",
                      field_label: "srO_ITEM_DESC",
                    })
                  }
                  loading={sroLoading}
                  options={sroOptions}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="sroItemSerialNo" label={translate('Item Sr. No.')}>
                <Select loading={itemNoLoading} options={itemNoOptions} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="fedPayable" label={translate('FED Payable')}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name="totalValues" label={translate('Total Invoice Amount')}>
                <InputNumber min={0} className="w-full" readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" className="mt-4">
            <Col>
              <Button
                type="primary"
                onClick={handleSaveItem}
                icon={<PlusOutlined />}
                disabled={isItemFormDisabled}
                className="flex items-center"
              >
                {translate('Save Item')}
              </Button>
            </Col>
          </Row>
        </Form>

        <Divider className="bg-teal-600 text-white font-bold text-lg py-2 rounded">
          {translate('Items List')}
        </Divider>

        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey={(record, index) => index}
          scroll={{ x: 'max-content' }}
          className="overflow-x-auto"
        />

        <Form.List name="items">
          {() => null}
        </Form.List>

        <Divider className="border-gray-300" />

        <div className="flex justify-end w-full">
          <Row gutter={[12, 0]} className="w-full max-w-xs">
            <Col span={12}>
              <p className="text-right font-semibold m-0">{translate('Total')}:</p>
            </Col>
            <Col span={12}>
              <MoneyInputFormItem readOnly value={total} className="w-full" />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}