import { useState, useEffect } from "react";
import { Form, Button } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { erp } from "@/redux/erp/actions";
import { selectRecordPaymentItem } from "@/redux/erp/selectors";
import useLanguage from "@/locale/useLanguage";

import Loading from "@/components/Loading";

import PaymentForm from "@/forms/PaymentForm";
import { useNavigate } from "react-router-dom";
import calculate from "@/utils/calculate";

export default function RecordPayment({ config }) {
  const navigate = useNavigate();
  const translate = useLanguage();
  let { entity } = config;

  const dispatch = useDispatch();

  const {
    isLoading,
    isSuccess,
    current: currentInvoice,
  } = useSelector(selectRecordPaymentItem);

  const [form] = Form.useForm();

  const [maxAmount, setMaxAmount] = useState(0);
  useEffect(() => {
    if (currentInvoice) {
      const { credit, total, discount } = currentInvoice;
      setMaxAmount(calculate.sub(calculate.sub(total, discount), credit));
    }
  }, [currentInvoice]);
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: "recordPayment" }));
      dispatch(erp.list({ entity }));
      navigate(`/${entity}/`);
    }
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (currentInvoice) {
      const { _id: invoice } = currentInvoice;
      console.log(currentInvoice);
      const client =
        currentInvoice.buyerBusinessName &&
        currentInvoice.buyerBusinessName._id;
      const number = currentInvoice && currentInvoice.invoiceRefNo;

      fieldsValue = {
        ...fieldsValue,
        invoice,
        client,
        number,
      };
    }

    dispatch(
      erp.recordPayment({
        entity: "payment",
        jsonData: fieldsValue,
      })
    );
  };

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <PaymentForm maxAmount={maxAmount} />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#0D1B2A",
              color: "#FFFFFF",
            }}
          >
            {translate("Record Payment")}
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
