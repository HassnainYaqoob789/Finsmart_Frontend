import { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { selectUpdatedItem } from '@/redux/erp/selectors';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

import calculate from '@/utils/calculate';
import PaymentForm from '@/forms/PaymentForm';
import { useNavigate } from 'react-router-dom';

export default function UpdatePayment({ config, currentInvoice }) {
  const translate = useLanguage();
  const navigate = useNavigate();
  let { entity } = config;
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount, amount } = currentInvoice;
  
      setMaxAmount(
        calculate.sub(calculate.sub(total, discount), calculate.sub(credit, amount))
      );
  
      const newInvoiceValues = { ...currentInvoice };
  
      // Convert all date fields to dayjs objects
      if (newInvoiceValues.date) {
        newInvoiceValues.date = dayjs(newInvoiceValues.date);
      }
      if (newInvoiceValues.cheque_date) {
        newInvoiceValues.cheque_date = dayjs(newInvoiceValues.cheque_date);
      }
      if (newInvoiceValues.deposit_date) {
        newInvoiceValues.deposit_date = dayjs(newInvoiceValues.deposit_date);
      }
  
      console.log("newInvoiceValues", newInvoiceValues);
      form.setFieldsValue(newInvoiceValues);
    }
  }, [currentInvoice, form, calculate, setMaxAmount]);

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'recordPayment' }));
      dispatch(erp.list({ entity }));
      navigate(`/${entity.toLowerCase()}/read/${currentInvoice._id}`);
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (currentInvoice) {
      const { _id: invoice } = currentInvoice;
      const client = currentInvoice.client && currentInvoice.client._id;
      const number = currentInvoice && currentInvoice.number

      fieldsValue = {
        ...fieldsValue,
        invoice,
        client,
        number
      };
    }

    dispatch(
      erp.update({
        entity,
        id: currentInvoice._id,
        jsonData: fieldsValue,
      })
    );
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <PaymentForm maxAmount={maxAmount} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {translate('Update')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
