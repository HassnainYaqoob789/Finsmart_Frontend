import { useState, useEffect } from "react";
import { Divider, QRCode } from "antd";
import { Button, Row, Col, Descriptions, Statistic } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erp } from "@/redux/erp/actions";
import { generate as uniqueId } from "shortid";
import { selectCurrentItem } from "@/redux/erp/selectors";
import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";
import { useMoney } from "@/settings";
import { useNavigate } from "react-router-dom";
import fbrlogo from "../../style/images/fbr.png";

const Item = ({ item, currentErp }) => {
  const { moneyFormatter } = useMoney();
  const itemTotal = item.valueSalesExcludingST + item.salesTaxApplicable;
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={7}>
        <p style={{ marginBottom: 5 }}>
          <strong>
            {item.item["Product Name"]} {item.uoM && `(${item.uoM})`}
          </strong>
        </p>
        <p style={{ color: "grey" }}>{item.item.description}</p>
      </Col>
      <Col className="gutter-row" span={2}>
        <p style={{ textAlign: "right" }}>x{item.quantity}</p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p style={{ textAlign: "right" }}>
          {moneyFormatter({
            amount: item.valueSalesExcludingST,
            currency_code: currentErp.currency,
          })}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p style={{ textAlign: "right" }}>
          {moneyFormatter({
            amount: item.salesTaxApplicable,
            currency_code: currentErp.currency,
          })}{" "}
          ({item.rate})
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p style={{ textAlign: "right", fontWeight: "700" }}>
          {moneyFormatter({
            amount: itemTotal,
            currency_code: currentErp.currency,
          })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { moneyFormatter } = useMoney();
  const { result: currentResult } = useSelector(selectCurrentItem);

  const resetErp = {
    status: "",
    buyerBusinessName: {
      name: "",
      email: "",
      phone: "",
      address: "",
      "NTN#": "",
      province: "",
      country: "",
    },
    subTotal: 0,
    taxTotal: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
    FbrInvoiceNo: "",
  };

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});
  const [computedTotal, setComputedTotal] = useState(0);

  useEffect(() => {
    if (currentResult) {
      const { items, ...others } = currentResult;
      if (items) {
        setItemsList(items);
        // Calculate total from items
        const total = items.reduce(
          (sum, item) =>
            sum + (item.valueSalesExcludingST + item.salesTaxApplicable),
          0
        );
        setComputedTotal(total);
        setCurrentErp({ ...currentResult, total });
      }
    }
    return () => {
      setItemsList([]);
      setCurrentErp(resetErp);
      setComputedTotal(0);
    };
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.buyerBusinessName) {
      setClient(currentErp.buyerBusinessName);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.invoiceRefNo}/${currentErp.year || ""
          }`}
        ghost={false}
        tags={[
          <span
            key="status"
            style={{
              background: currentErp.status !== "sent" ? "beige" : "cyan",
              padding: "4px 8px",
              borderRadius: "50px",
              fontSize: "12px",
            }}
          >
            {currentErp.status && translate(currentErp.status)}
          </span>,
          currentErp.paymentStatus && (
            <span
              style={{
                background:
                  currentErp.paymentStatus === "unpaid"
                    ? "yellow"
                    : "lightgreen",
                padding: "4px 8px",
                borderRadius: "50px",
                fontSize: "12px",
                marginLeft: 10,
              }}
            >
              {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
            </span>
          ),
        ]}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#E53935",
              color: "#FFFFFF",
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate("Close")}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${currentErp.pdf}`,
                "_blank"
              );
            }}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#43A047",
              color: "#FFFFFF",
            }}
            icon={<FilePdfOutlined />}
          >
            {translate("Download PDF")}
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(erp.convert({ entity, id: currentErp._id }));
            }}
            icon={<RetweetOutlined />}
            style={{ display: entity === "quote" ? "inline-block" : "none" }}
          >
            {translate("Convert to Invoice")}
          </Button>,
          // <Button
          //   key={`${uniqueId()}`}
          //   onClick={() => {
          //     dispatch(
          //       erp.currentAction({
          //         actionType: 'update',
          //         data: currentErp,
          //       })
          //     );
          //     navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
          //   }}
          //   type="primary"
          //   icon={<EditOutlined />}
          // >
          //   {translate('Edit')}
          // </Button>,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Row>
            <Statistic
              style={{ margin: "10px 22px" }}
              title="Invoice Status"
              value={translate(currentErp.status)}
            />
            <Statistic
              title={translate("Total")}
              value={moneyFormatter({
                amount: computedTotal,
                currency_code: currentErp.currency,
              })}
              style={{ margin: "10px 22px" }}
            />
            <Statistic
              title={translate("Paid")}
              value={moneyFormatter({
                amount: currentErp.credit,
                currency_code: currentErp.currency,
              })}
              style={{ margin: "10px 22px" }}
            />
          </Row>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {currentErp.FbrInvoiceNo && (
              <img width={150} src={fbrlogo} style={{ marginBottom: 20 }} />
            )}

            {currentErp.FbrInvoiceNo && (
              <QRCode value={currentErp.FbrInvoiceNo} size={100} />
            )}
          </div>
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`${translate("Client")} : ${client.name || "N/A"}`}>
        <Descriptions.Item label={"NTN#"}>
          {client["NTN#"] || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label={translate("Address")}>
          {client.address || "N/A"}, {client.province || "N/A"},{" "}
          {client.country || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label={translate("email")}>
          {client.email || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label={translate("Phone")}>
          {client.phone || "N/A"}
        </Descriptions.Item>
      </Descriptions>
      <Divider />

      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={7}>
          <p>
            <strong>{translate("Product")}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={2}>
          <p style={{ textAlign: "right" }}>
            <strong>Quantity</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p style={{ textAlign: "right" }}>
            <strong>{translate("Price")}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p style={{ textAlign: "right" }}>
            <strong>Tax</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p style={{ textAlign: "right" }}>
            <strong>{translate("Total")}</strong>
          </p>
        </Col>
        <Divider />
      </Row>
      {itemslist.map((item) => (
        <Item key={item._id} item={item} currentErp={currentErp}></Item>
      ))}
      <div
        style={{
          width: "300px",
          float: "right",
          textAlign: "right",
          fontWeight: "700",
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{translate("Total")} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({
                amount: computedTotal,
                currency_code: currentErp.currency,
              })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
