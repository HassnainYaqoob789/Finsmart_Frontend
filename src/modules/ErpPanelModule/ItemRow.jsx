import { useState, useEffect } from 'react';
import { Input, InputNumber, Row, Col, Select, Form, Modal, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';
import useLanguage from '@/locale/useLanguage';

const { TextArea } = Input;
const { Option } = Select;

export default function ItemRow({ field, remove, current = null, form }) {
  const [totalState, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [tax, setTax] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const money = useMoney();
  const translate = useLanguage();

  // API call to fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const auth = storePersist.get('auth');
        const response = await axios.get(`${API_BASE_URL}/product/search?q=&fields=Product%20Name`, {
          headers: {
            Authorization: `Bearer ${auth?.current?.token}`,
          },
        });
        
        if (response.data.success) {
          setProducts(response.data.result);
        }
      } catch (error) {
        console.error(`Error fetching products for row ${field.key}:`, error);
      }
    };

    fetchProducts();
  }, [field.key]);

  // Handle existing invoice data
  useEffect(() => {
    if (current) {
      const { items, invoice } = current;
      const item = invoice ? invoice[field.fieldKey] : items?.[field.fieldKey];

      if (item) {
        setQuantity(item.quantity || 0);
        setPrice(item.price || 0);
        setTax(item.tax || 0);
        const product = products.find((p) => p['Product Name'] === item.itemName);
        if (product) {
          setSelectedProduct(product);
        }
        form.setFieldsValue({
          items: {
            [field.name]: {
              itemName: item.itemName,
              description: item.description,
              uom: item.uom,
              tax: item.tax || 0,
              quantity: item.quantity || 0,
              price: item.price || 0,
            },
          },
        });
      }
    }
  }, [current, field, products, form]);

  // Update total when price, quantity, or tax changes
  useEffect(() => {
    const subtotal = calculate.multiply(price, quantity);
    const taxAmount = calculate.multiply(subtotal, tax / 100);
    const totalWithTax = calculate.add(subtotal, taxAmount);
    setTotal(totalWithTax);
    form.setFieldsValue({
      items: {
        [field.name]: {
          total: totalWithTax,
        },
      },
    });
  }, [price, quantity, tax, form, field]);

  // Handle product selection
  const handleProductSelect = (value) => {
    if (value === 'add_new_product') {
      setIsModalVisible(true);
      return;
    }

    const product = products.find((p) => p['Product Name'] === value);
    setSelectedProduct(product);
    
    if (product) {
      setTax(product.category?.tax || 0);
      form.setFieldsValue({
        items: {
          [field.name]: {
            itemName: product['Product Name'],
            description: product['Product Description'],
            uom: product['uom'],
            tax: product.category?.tax || 0,
          },
        },
      });
    } else {
      setTax(0);
      form.setFieldsValue({
        items: {
          [field.name]: {
            itemName: undefined,
            description: undefined,
            uom: undefined,
            tax: 0,
          },
        },
      });
    }
  };

  // Handle new product creation
  const handleCreateProduct = async (values) => {
    try {
      const auth = storePersist.get('auth');
      const response = await axios.post(`${API_BASE_URL}/product`, {
        'Product Name': values.productName,
        'Product Description': values.productDescription,
        'uom': values.uom,
        category: { tax: values.tax || 0 },
      }, {
        headers: {
          Authorization: `Bearer ${auth?.current?.token}`,
        },
      });

      if (response.data.success) {
        const newProduct = response.data.result;
        setProducts((prev) => [...prev, newProduct]);
        setSelectedProduct(newProduct);
        form.setFieldsValue({
          items: {
            [field.name]: {
              itemName: newProduct['Product Name'],
              description: newProduct['Product Description'],
              uom: newProduct['UOM (Unit of Measure)'],
              tax: newProduct.category?.tax || 0,
            },
          },
        });
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error(`Error creating product for row ${field.key}:`, error);
    }
  };

  const updateQt = (value) => {
    setQuantity(value || 0);
  };

  const updatePrice = (value) => {
    setPrice(value || 0);
  };

  // Product options for Select
  const productOptions = [
    { label: translate('Add New Product'), value: 'add_new_product' },
    ...products.map((product) => ({
      label: product['Product Name'],
      value: product['Product Name'],
    })),
  ];

  return (
    <>
      <Row key={field.key} gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={5}>
          <Form.Item
            name={[field.name, 'itemName']}
            rules={[
              { required: true, message: translate('Please select an item') },
              {
                pattern: /^(?!\s*$)[\s\S]+$/,
                message: translate('Item Name must contain alphanumeric or special characters'),
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={productOptions}
              placeholder={translate('Select Item')}
              onChange={handleProductSelect}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item name={[field.name, 'description']}>
            <TextArea disabled placeholder={translate('Description')} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={2}>
          <Form.Item name={[field.name, 'uom']}>
            <Input disabled placeholder="UOM" />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={2}>
          <Form.Item
            name={[field.name, 'quantity']}
            rules={[{ required: true, message: translate('Enter quantity') }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            name={[field.name, 'price']}
            rules={[{ required: true, message: translate('Enter price') }]}
          >
            <InputNumber
              className="moneyInput"
              onChange={updatePrice}
              min={0}
              controls={false}
              addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
              addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item name={[field.name, 'tax']}>
            <InputNumber
              disabled
              className="moneyInput"
              min={0}
              controls={false}
              addonAfter={'%'}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={4}>
          <Form.Item name={[field.name, 'total']}>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
              addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
              formatter={(value) =>
                money.amountFormatter({ amount: value, currency_code: money.currency_code })
              }
            />
          </Form.Item>
        </Col>
        <div style={{ position: 'absolute', right: '-20px', top: '5px' }}>
          <DeleteOutlined onClick={() => remove(field.name)} />
        </div>
      </Row>
      <Modal
        title={translate('Create New Product')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          onFinish={handleCreateProduct}
          layout="vertical"
        >
          <Form.Item
            name="productName"
            label={translate('Product Name')}
            rules={[{ required: true, message: translate('Please enter product name') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productDescription"
            label={translate('Description')}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="uom"
            label="UOM"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tax"
            label={translate('Tax (%)')}
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {translate('Save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}