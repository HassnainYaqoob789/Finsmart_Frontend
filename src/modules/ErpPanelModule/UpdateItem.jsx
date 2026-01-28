import { useState, useEffect } from "react";
import { Button, Tag, Divider } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erp } from "@/redux/erp/actions";
import { selectUpdatedItem } from "@/redux/erp/selectors";
import calculate from "@/utils/calculate";
import { generate as uniqueId } from "shortid";
import Loading from "@/components/Loading";
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { settingsAction } from "@/redux/settings/actions";
import { Form } from "antd";
import dayjs from "dayjs";

function SaveForm({ form, translate }) {
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await form.validateFields();
      console.log("Form values:", form.getFieldsValue());
      form.submit();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      type="primary"
      icon={<PlusOutlined />}
      style={{
        borderRadius: "8px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#0D1B2A",
        color: "#FFFFFF",
      }}
    >
      {translate("Update")}
    </Button>
  );
}

export default function UpdateItem({ config, UpdateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entity } = config;
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    dispatch(settingsAction.list({ entity: "setting" }));
  }, [dispatch]);

  const handleValuesChange = (changedValues, values) => {
    const items = values["items"];
    let subTotal = 0;
    let subOfferTotal = 0;

    if (items) {
      items.forEach((item) => {
        if (item) {
          if (item.quantity && item.offerPrice) {
            let offerTotal = calculate.multiply(item.quantity, item.offerPrice);
            const taxAmount = calculate.multiply(offerTotal, item.tax / 100);
            const totalWithTax = calculate.add(offerTotal, taxAmount);
            subOfferTotal = calculate.add(subOfferTotal, totalWithTax);
          }
          if (item.quantity && item.valueSalesExcludingST) {
            let total = calculate.multiply(
              item.quantity,
              item.valueSalesExcludingST
            );
            const taxAmount = calculate.multiply(
              total,
              item.salesTaxApplicable / item.valueSalesExcludingST || 0
            );
            const totalWithTax = calculate.add(total, taxAmount);
            subTotal = calculate.add(subTotal, totalWithTax);
          }
        }
      });
      setSubTotal(subTotal);
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      setOfferSubTotal(0);
      dispatch(erp.resetAction({ actionType: "update" }));
      navigate(`/${entity.toLowerCase()}/read/${id}`);
    }
  }, [isSuccess, form, navigate, id, entity]);

  useEffect(() => {
    if (current) {
      // Transform current data to match InvoiceForm structure
      const formData = {
        taxRate: current.taxRate || 0,
        year: current.year || new Date().getFullYear(),
        number: current.number || 0,
        invoiceDate: current.invoiceDate ? dayjs(current.invoiceDate) : null,
        invoiceType: current.invoiceType || "Sale Invoice",
        invoiceRefNo: current.invoiceRefNo || "",
        scenarioId: current.scenarioId || undefined,
        sellerBusinessName: current.sellerBusinessName || "",
        sellerProvince: current.sellerProvince || "",
        sellerNTNCNIC: current.sellerNTNCNIC || "",
        sellerAddress: current.sellerAddress || "",
        buyerBusinessName: current.buyerBusinessName?.name || "",
        buyerProvince: current.buyerProvince || "",
        buyerNTNCNIC: current.buyerNTNCNIC || "",
        buyerAddress: current.buyerBusinessName?.address || "",
        buyerRegistrationType: current.buyerRegistrationType || "Registered",
        saleType: current.items[0].saleType || undefined,
        fbrsubmit: current.FbrInvoiceNo ? true : false,
        FbrInvoiceNo: current.FbrInvoiceNo || "",
        items:
          current.items?.map((item) => ({
            hsCode: item.hsCode || "",
            productId: item.productId || "",
            productDescription:
              item.productDescription || item.item["Product Name"] || "",
            rate: item.rate || "0%",
            uoM: item.uoM || "",
            quantity: item.quantity || 0,
            valueSalesExcludingST:
              item.valueSalesExcludingST || item.price || 0,
            fixedNotifiedValueOrRetailPrice:
              item.fixedNotifiedValueOrRetailPrice || 0,
            salesTaxApplicable:
              item.salesTaxApplicable ||
              calculate.multiply(item.price || 0, item.tax / 100 || 0),
            salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
            extraTax: item.extraTax || 0,
            furtherTax: item.furtherTax || 0,
            sroScheduleNo: item.sroScheduleNo || "",
            sroItemSerialNo: item.sroItemSerialNo || "",
            fedPayable: item.fedPayable || 0,
            discount: item.discount || 0,
            totalValues: item.totalValues || item.total || 0,
            saleType: item.saleType || "",
          })) || [],
      };

      form.resetFields();
      form.setFieldsValue(formData);
      setSubTotal(
        formData.items.reduce(
          (sum, item) => calculate.add(sum, item.totalValues || 0),
          0
        )
      );
      setOfferSubTotal(
        formData.items.reduce(
          (sum, item) =>
            calculate.add(
              sum,
              item.offerPrice
                ? calculate.multiply(item.quantity, item.offerPrice)
                : 0
            ),
          0
        )
      );
    }
  }, [current, form]);

  const onSubmit = (fieldsValue) => {
    console.log("Form data on submit:", fieldsValue);
    if (fieldsValue?.items) {
      const newTaxTotal = fieldsValue.items.reduce(
        (sum, item) => calculate.add(sum, item.salesTaxApplicable || 0),
        0
      );
      const newSubTotal = fieldsValue.items.reduce(
        (sum, item) => calculate.add(sum, item.valueSalesExcludingST || 0),
        0
      );
      const newTotal = calculate.add(newSubTotal, newTaxTotal);
      const { saleType, ...restFields } = fieldsValue;

      const dataToUpdate = {
        ...restFields,
        total: newTotal,
        items: fieldsValue.items,
        invoiceDate: fieldsValue.invoiceDate
          ? dayjs(fieldsValue.invoiceDate).format("YYYY-MM-DD")
          : null,
      };

      dispatch(erp.update({ entity, id, jsonData: dataToUpdate }));
    }
  };

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/${entity.toLowerCase()}`)}
        backIcon={<ArrowLeftOutlined />}
        title={translate("Update")}
        ghost={false}
        tags={<Tag>{translate(current?.status || "Draft")}</Tag>}
        extra={[
          <Button
            key={uniqueId()}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#E53935",
              color: "#FFFFFF",
            }}
          >
            {translate("Cancel")}
          </Button>,
          <SaveForm form={form} translate={translate} key={uniqueId()} />,
        ]}
        style={{ padding: "20px 0px" }}
      />
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <UpdateForm
          form={form} // Pass form prop explicitly
          subTotal={subTotal}
          offerTotal={offerSubTotal}
          current={current}
          onFinish={onSubmit}
          onValuesChange={handleValuesChange}
        />
      </Loading>
    </>
  );
}
