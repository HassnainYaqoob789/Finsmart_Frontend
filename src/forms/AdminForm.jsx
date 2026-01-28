import MultipleSelectAsync from '@/components/MultipleSelectAsync/MultipleSelectAsync';
import SelectAsync from '@/components/SelectAsync';
import { Form, Input, Switch, Select, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminForm() {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please enter name',
          },
        ]}
      >
        <Input placeholder="Enter admin name" />
      </Form.Item>

      <Form.Item
        label="Surname"
        name="surname"
      >
        <Input placeholder="Enter surname" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: 'email',
            message: 'Please enter a valid email',
          },
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            min: 8,
            message: 'Password must be at least 8 characters',
          },
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        label="NTN"
        name="ntn"
        rules={[
          {
            required: true,
            message: 'Please enter NTN',
          },
        ]}
      >
        <Input placeholder="Enter NTN number" />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: 'Please enter address',
          },
        ]}
      >
        <TextArea placeholder="Enter full address" rows={3} />
      </Form.Item>

      <Form.Item
        label="Province"
        name="province"
        rules={[
          {
            required: true,
            message: 'Please select province',
          },
        ]}
      >
        <Select placeholder="Select province">
          <Option value="Sindh">Sindh</Option>
          <Option value="Punjab">Punjab</Option>
          <Option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</Option>
          <Option value="Balochistan">Balochistan</Option>
          <Option value="Gilgit-Baltistan">Gilgit-Baltistan</Option>
          <Option value="Azad Kashmir">Azad Kashmir</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Scenarios"
        name="scenarioIds"
      >
        <MultipleSelectAsync
          entity={'scenario'}
          displayLabels={['scenarioId', 'saleType']}
          mode="multiple"
                    placeholder="Select one or more scenarios"

        />
      </Form.Item>

    <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: 'Please select role',
          },
        ]}
      >
        <Select placeholder="Select role">
          <Option value="owner">Owner</Option>
        </Select>
      </Form.Item>

      {/* Creds Section - Single set of tokens */}
      <Form.Item
        label="Sandbox Token"
        name={['Creds', 0, 'sandbox_token']}
      >
        <Input placeholder="Enter sandbox token" />
      </Form.Item>

      <Form.Item
        label="Production Token"
        name={['Creds', 0, 'production_token']}
      >
        <Input placeholder="Enter production token" />
      </Form.Item>
    </>
  );
}