import { useState, useEffect } from "react";
import { Button, Tag, Divider, message } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { settingsAction } from "@/redux/settings/actions";
import { erp } from "@/redux/erp/actions";
import { selectCreatedItem } from "@/redux/erp/selectors";
import { API_BASE_URL } from '@/config/serverApiConfig';
import calculate from "@/utils/calculate";
import { generate as uniqueId } from "shortid";
import Loading from "@/components/Loading";
import dayjs from 'dayjs';
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import axios from "axios";

function SaveForm({ form }) {
  const translate = useLanguage();
  const [loadingValidate, setLoadingValidate] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await form.validateFields();
      form.submit();
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleValidateFBR = async () => {
    try {
      setLoadingValidate(true);
      await form.validateFields();

      const values = form.getFieldsValue();
      const today = dayjs().format('YYYY-MM-DD');
      console.log("checkData", values)
      const payload = {
        invoiceType: values.invoiceType,
        // invoiceDate: today,
        invoiceDate: values.invoiceDate
          ? dayjs(values.invoiceDate).format('YYYY-MM-DD')   // ← yeh line add karo
          : null,
        sellerBusinessName: values.sellerBusinessName,
        sellerProvince: values.sellerProvince,
        sellerNTNCNIC: values.sellerNTNCNIC,
        sellerAddress: values.sellerAddress,
        buyerNTNCNIC: values.buyerNTNCNIC,
        buyerBusinessName: values.buyerBusinessName,
        buyerProvince: values.buyerProvince,
        buyerAddress: values.buyerAddress,
        invoiceRefNo: values.invoiceRefNo || "",
        buyerRegistrationType: values.buyerRegistrationType,
        scenarioId: values.scenarioId,
        items: values.items?.map((item) => ({
          hsCode: item.hsCode,
          productDescription: item.productDescription,
          rate: item.rate,
          uoM: item.uoM,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          salesTax: item.salesTax,
          valueSalesExcludingST: item.valueSalesExcludingST,
          fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
          salesTaxApplicable: item.salesTaxApplicable,
          salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
          extraTax: item.extraTax,
          furtherTax: item.furtherTax,
          sroScheduleNo: item.sroScheduleNo,
          fedPayable: item.fedPayable,
          discount: item.discount,
          totalValues: item.totalValues,
          saleType: item.saleType,
          sroItemSerialNo: item.sroItemSerialNo,
        })) || [],
      };

      const response = await axios.patch(`${API_BASE_URL}/validatefbrdata`, payload);

      if (response.data.success) {
        const validationStatus = response.data.result?.validationResponse?.status;

        if (validationStatus === "Valid") {
          message.success(translate("Invoice is valid with FBR"), 8);
        } else {
          // Invalid ya koi aur status
          const errorMessage =
            response.data.result?.validationResponse?.error ||
            response.data.result?.validationResponse?.invoiceStatuses?.[0]?.error ||
            response.data.message ||
            "Validation failed - unknown error";

          message.error(`${translate("Invoice validation failed")}: ${errorMessage}`, 10);
        }
      } else {
        // success: false case
        message.error(response.data.message || translate("FBR API call failed"), 8);
      }
    } catch (error) {
      console.error("FBR validation error:", error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        translate("Error while validating with FBR");
      message.error(errMsg, 8);
    } finally {
      setLoadingValidate(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button
        onClick={handleValidateFBR}
        loading={loadingValidate}
        icon={<SafetyCertificateOutlined />}
        style={{
          borderRadius: "8px",
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {translate("Validate FBR Invoice")}
      </Button>

      <Button
        onClick={handleSave}
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
        {translate("Save")}
      </Button>
    </div>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entity } = config;
  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);

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
          if (item.offerPrice && item.quantity) {
            let offerTotal = calculate.multiply(item.quantity, item.offerPrice);
            const taxAmount = calculate.multiply(offerTotal, item.tax / 100);
            const totalWithTax = calculate.add(offerTotal, taxAmount);
            subOfferTotal = calculate.add(subOfferTotal, totalWithTax);
          }
          if (item.quantity && item.price) {
            let offerTotal = calculate.multiply(item.quantity, item.price);
            const taxAmount = calculate.multiply(offerTotal, item.tax / 100);
            const totalWithTax = calculate.add(offerTotal, taxAmount);
            subTotal = calculate.add(subTotal, totalWithTax);
          }
        }
      });
      setSubTotal(subTotal);
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess && result && result._id) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: "create" }));
      setSubTotal(0);
      setOfferSubTotal(0);
      // navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
  }, [isSuccess, result, entity, form, navigate, dispatch]);

  const onSubmit = (fieldsValue) => {
    if (fieldsValue?.items) {
      const newTaxTotal = fieldsValue.items?.reduce(
        (sum, item) => calculate.add(sum, item.salesTaxApplicable || 0),
        0
      );
      const newSubTotal = fieldsValue.items?.reduce(
        (sum, item) => calculate.add(sum, item.valueSalesExcludingST || 0),
        0
      );
      const newTotal = calculate.add(newSubTotal, newTaxTotal);

      const { saleType, ...restFields } = fieldsValue;

      fieldsValue = {
        ...restFields,
        total: newTotal,
        items: fieldsValue.items,
      };
    }
    dispatch(erp.create({ entity, jsonData: fieldsValue }));
  };

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/${entity.toLowerCase()}`)}
        backIcon={<ArrowLeftOutlined />}
        title={translate("New")}
        ghost={false}
        tags={<Tag>{translate("Draft")}</Tag>}
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
          <SaveForm form={form} key={uniqueId()} />,
        ]}
        style={{ padding: "20px 0px" }}
      />
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <CreateForm
          subTotal={subTotal}
          offerTotal={offerSubTotal}
          form={form}
          onFinish={onSubmit}
          onValuesChange={handleValuesChange}
        />
      </Loading>
    </>
  );
}