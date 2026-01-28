import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Row, Col, Descriptions, Tag, Divider, Alert } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { FileTextOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { generate as uniqueId } from "shortid";
import { useMoney, useDate } from "@/settings";
import RecordPayment from "./RecordPayment";
import useLanguage from "@/locale/useLanguage";
import { useNavigate } from "react-router-dom";

export default function Payment({ config, currentItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const { dateFormat } = useDate();
  const money = useMoney();
  const navigate = useNavigate();

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(currentItem);
  const [client, setClient] = useState(null); // Store buyerBusinessName._id
  const [invoiceNumber, setInvoiceNumber] = useState(""); // Store invoiceRefNo
  const [error, setError] = useState(null); // Store validation errors

  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { items, buyerBusinessName, invoiceRefNo, invoiceDate } =
        currentItem;

      // Set items and current ERP
      setItemsList(items || []);
      setCurrentErp(currentItem);

      // Validate and set client
      if (buyerBusinessName?._id) {
        setClient(buyerBusinessName._id); // Map client to buyerBusinessName._id
      } else {
        setError("Client ID is missing in the invoice data.");
      }

      // Validate and set invoice number
      if (invoiceRefNo) {
        setInvoiceNumber(invoiceRefNo); // Map number to invoiceRefNo
      } else {
        setError((prev) =>
          prev
            ? `${prev} Invoice number is missing.`
            : "Invoice number is missing."
        );
      }
    } else {
      setError("No invoice data provided.");
    }

    return () => controller.abort();
  }, [currentItem]);

  // Debugging: Log data to verify
  useEffect(() => {
    console.log("Current Item:", currentItem);
    console.log("Client:", client);
    console.log("Invoice Number:", invoiceNumber);
  }, [currentItem, client, invoiceNumber]);

  return (
    <>
      {error && (
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={20} lg={20} push={2}>
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </Col>
        </Row>
      )}
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 20, push: 2 }}
        >
          <PageHeader
            onBack={() => navigate(`/${entity.toLowerCase()}`)}
            title={`Record Payment for ${ENTITY_NAME} # ${
              currentErp?.invoiceRefNo || "N/A"
            }/${
              currentErp?.invoiceDate
                ? dayjs(currentErp.invoiceDate).format(dateFormat)
                : "N/A"
            }`}
            ghost={false}
            tags={
              <span
                style={{
                  background:
                    currentErp?.paymentStatus === "unpaid"
                      ? "yellow"
                      : "lightgreen",
                  padding: "4px 8px",
                  borderRadius: "50px",
                  fontSize: "12px",
                }}
              >
                {currentErp?.paymentStatus
                  ? translate(currentErp.paymentStatus)
                  : "N/A"}
              </span>
            }
            extra={[
              <Button
                key={`${uniqueId()}`}
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
              <Button
                key={`${uniqueId()}`}
                onClick={() =>
                  navigate(`/invoice/read/${currentErp?._id || ""}`)
                }
                icon={<FileTextOutlined />}
                style={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#1565C0",
                  color: "#FFFFFF",
                }}
              >
                {translate("Show Invoice")}
              </Button>,
            ]}
            style={{
              padding: "20px 0px",
            }}
          />
          <Divider dashed />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 10, order: 2, push: 2 }}
          lg={{ span: 10, order: 2, push: 2 }}
        >
          <div className="space20"></div>
          <Descriptions
            title={`${translate("Client")} : ${
              currentErp?.buyerBusinessName?.name || "N/A"
            }`}
            column={1}
          >
            <Descriptions.Item label={translate("email")}>
              {currentErp?.buyerBusinessName?.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label={translate("phone")}>
              {currentErp?.buyerBusinessName?.phone || "N/A"}
            </Descriptions.Item>
            <Divider dashed />
            <Descriptions.Item label={translate("Invoice Date")}>
              {currentErp?.invoiceDate
                ? dayjs(currentErp.invoiceDate).format(dateFormat)
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label={translate("payment status")}>
              <span>
                {currentErp?.paymentStatus
                  ? translate(currentErp.paymentStatus)
                  : "N/A"}
              </span>
            </Descriptions.Item>
            <Divider dashed />
            <Descriptions.Item label={translate("total")}>
              {money.moneyFormatter({
                amount: currentErp?.total || 0,
                currency_code: currentErp?.currency || "USD",
              })}
            </Descriptions.Item>
            <Descriptions.Item label={translate("Paid")}>
              {money.moneyFormatter({
                amount: currentErp?.credit || 0,
                currency_code: currentErp?.currency || "USD",
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 14, order: 1 }}
        >
          {client && invoiceNumber ? (
            <RecordPayment
              config={config}
              client={client}
              number={invoiceNumber}
            />
          ) : (
            <Alert
              message="Cannot load payment form: Missing client or invoice number."
              type="warning"
              showIcon
            />
          )}
        </Col>
      </Row>
    </>
  );
}
