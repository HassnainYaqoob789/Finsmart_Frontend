import { Form, Input, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

const { Option } = Select;

export default function CategoryForm() {
  const [hsCodes, setHsCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHsCodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}user-fbr/hscode`);
        console.log(response.data.result);
        setHsCodes(response.data.result);
      } catch (error) {
        console.error('Error fetching HS Codes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHsCodes();
  }, []);

  return (
    <>
      <Form.Item
        label="HS Code: "
        name="HS Code"
        rules={[
          {
            required: true,
            message: 'Please select an HS Code!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Select an HS Code"
          loading={loading}
          filterOption={(input, option) =>
            // Combine hS_CODE and description for search
            `${option.value} ${option.description || ''}`
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          style={{ width: '100%' }}
        >
          {hsCodes.map((hsCode) => (
            <Option
              key={hsCode.hS_CODE}
              value={hsCode.hS_CODE}
              description={hsCode.description}
            >
              {hsCode.hS_CODE} {hsCode.description ? `- ${hsCode.description}` : ''}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Name: "
        name="Name"
        rules={[
          {
            required: true,
            message: 'Please input Name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description: "
        name="Description"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tax (%):"
        name="tax"
        rules={[
          {
            required: true,
            message: 'Please input tax value!',
            type: 'number',
            min: 0,
            max: 100,
          },
        ]}
      >
        <InputNumber min={0} max={100} suffix="%" style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}