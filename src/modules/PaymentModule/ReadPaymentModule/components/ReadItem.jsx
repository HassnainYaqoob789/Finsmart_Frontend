import { useState, useEffect } from "react";

import {
  Button,
  Row,
  Col,
  Descriptions,
  Statistic,
  Tag,
  Divider,
  Typography,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  MailOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { erp } from "@/redux/erp/actions";
import useLanguage from "@/locale/useLanguage";
import dayjs from "dayjs";

import { generate as uniqueId } from "shortid";

import { selectCurrentItem } from "@/redux/erp/selectors";

import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";
import { useMoney, useDate } from "@/settings";

import useMail from "@/hooks/useMail";
import { useNavigate } from "react-router-dom";

let bank_code = [
  {
    bank_name: "Habib Bank Limited",
    bank_code: "HBL",
    swift_code: "HABBPKKA",
  },
  {
    bank_name: "United Bank Limited",
    bank_code: "UBL",
    swift_code: "UNILPKKA",
  },
  {
    bank_name: "National Bank of Pakistan",
    bank_code: "NBP",
    swift_code: "NBPAPKKAXXX",
  },
  {
    bank_name: "MCB Bank Limited",
    bank_code: "MCB",
    swift_code: "MCBLPKKA",
  },
  {
    bank_name: "Bank Alfalah",
    bank_code: "BAFL",
    swift_code: "BAFLPKKA",
  },
  {
    bank_name: "Bank Islami Pakistan Limited",
    bank_code: "BIPL",
    swift_code: "BIPLPKKA",
  },
  {
    bank_name: "Standard Chartered Bank (Pakistan) Limited",
    bank_code: "SCBPL",
    swift_code: "SCBLPKKA",
  },
  {
    bank_name: "Faysal Bank",
    bank_code: "FBL",
    swift_code: "FAYLPKKA",
  },
  {
    bank_name: "Bank of Punjab",
    bank_code: "BOP",
    swift_code: "BOPUPKKA",
  },
  {
    bank_name: "Allied Bank Limited",
    bank_code: "ABL",
    swift_code: "ABLPPKKA",
  },
  {
    bank_name: "First Women Bank Limited",
    bank_code: "FWBL",
    swift_code: "FWBLPKKA",
  },
  {
    bank_name: "The Bank of Khyber",
    bank_code: "BOK",
    swift_code: "BOKUPKKA",
  },
  {
    bank_name: "Soneri Bank Limited",
    bank_code: "SBL",
    swift_code: "SNRIPKKA",
  },
  {
    bank_name: "Bank Al Habib",
    bank_code: "BAH",
    swift_code: "BAHLPKKA",
  },
  {
    bank_name: "Bank of Azad Jammu & Kashmir",
    bank_code: "BAJK",
    swift_code: "BAJKPKKA",
  },
  {
    bank_name: "First Commercial Bank of China",
    bank_code: "FCB",
    swift_code: "FCBLPKKA",
  },
  {
    bank_name: "Habib Metropolitan Bank",
    bank_code: "HMB",
    swift_code: "HMBLPKKA",
  },
  {
    bank_name: "The Royal Bank of Scotland",
    bank_code: "RBS",
    swift_code: "RBOSPKKA",
  },
  {
    bank_name: "Pak Oman Investment Company",
    bank_code: "POIC",
    swift_code: "POICPKKA",
  },
  {
    bank_name: "National Investment Trust Limited",
    bank_code: "NIT",
    swift_code: "NITPKKA",
  },
  {
    bank_name: "Bank of China",
    bank_code: "BOC",
    swift_code: "BKCHPKKA",
  },
  {
    bank_name: "Citibank",
    bank_code: "Citi",
    swift_code: "CITIPKKA",
  },
  {
    bank_name: "China Development Bank",
    bank_code: "CDB",
    swift_code: "CDBLPKKA",
  },
  {
    bank_name: "Pak Libya Holding Company",
    bank_code: "PLHC",
    swift_code: "PLHCPKKA",
  },
  {
    bank_name: "Summit Bank Limited",
    bank_code: "SBL",
    swift_code: "SSTMPKKA",
  },
  {
    bank_name: "Sindh Bank",
    bank_code: "SB",
    swift_code: "SINDPKKA",
  },
  {
    bank_name: "U Microfinance Bank Limited",
    bank_code: "UMBL",
    swift_code: "UMBLPKKA",
  },
  {
    bank_name: "Mobilink Microfinance Bank",
    bank_code: "MMBL",
    swift_code: "MMBLPKKA",
  },
  {
    bank_name: "FINCA Microfinance Bank",
    bank_code: "FMFB",
    swift_code: "FMFBPKKA",
  },
  {
    bank_name: "First Dawn Microfinance Bank",
    bank_code: "FDM",
    swift_code: "FDMMPKKA",
  },
  {
    bank_name: "FINCORP",
    bank_code: "FIN",
    swift_code: "FINCPKKA",
  },
];

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { dateFormat } = useDate();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });
  const navigate = useNavigate();

  const { result: currentResult } = useSelector(selectCurrentItem);

  function getBankLabelByCode(code) {
    const bank = bank_code.find((b) => b.bank_code === code);
    return bank ? `${bank.bank_name} (${bank.bank_code})` : null;
  }

  const resetErp = {
    status: "",
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  };

  const [currentErp, setCurrentErp] = useState(selectedItem ?? resetErp);
  const [client, setClient] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    if (currentResult) {
      const { invoice, _id, ...others } = currentResult;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ""}`}
        ghost={false}
        tags={
          <span
            style={{
              background:
                currentErp.paymentStatus === "unpaid" ? "yellow" : "lightgreen",
              padding: "4px 8px",
              borderRadius: "50px",
              fontSize: "12px",
            }}
          >
            {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
          </span>
        }
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
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
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
              dispatch(
                erp.currentAction({
                  actionType: "update",
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#0D1B2A",
              color: "#FFFFFF",
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate("Edit")}
          </Button>,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic
            style={{
              margin: "10px 22px",
            }}
            title="Invoice Status"
            value={translate(currentErp.status)}
          />
          <Statistic
            title={translate("Paid")}
            value={moneyFormatter({
              amount: currentErp.amount,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: "10px 22px",
            }}
          />
          {/* <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({
              amount: currentErp.subTotal,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          /> */}

          <Statistic
            title={translate("Total")}
            value={moneyFormatter({
              amount: currentErp.total,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: "10px 22px",
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions
        title={`${translate("Client")} : ${currentErp.client.name}`}
      >
        <Descriptions.Item label={"NTN#"}>{client["NTN#"]}</Descriptions.Item>
        <Descriptions.Item label={translate("Address")}>
          {client.address}, {client.province}, {client.country}
        </Descriptions.Item>
        <Descriptions.Item label={translate("email")}>
          {client.email}
        </Descriptions.Item>
        <Descriptions.Item label={translate("Phone")}>
          {client.phone}
        </Descriptions.Item>
        <Descriptions.Item label={"Remarks"}>
          {client.remarks}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>
            {translate("Payment Information")} :
          </Typography.Title>
        </Col>
        <Col sm={24} md={12} style={{ textAlign: "right" }}>
          <Button icon={<ExportOutlined />}>{translate("Show invoice")}</Button>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "16px",
          fontWeight: 700,
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <p>Cheque No :</p>
          <p>{currentErp.cheque_no}</p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>Cheque Date :</p>
          <p>{dayjs(currentErp.cheque_date).format(dateFormat)}</p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>Bank Code :</p>
          <p>{getBankLabelByCode(currentErp.bank_code)}</p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>Remarks :</p>
          <p>{currentErp.remarks}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "16px",
          fontWeight: 700,
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <p>Deposit Bank :</p>
          <p>{getBankLabelByCode(currentErp.deposit_bank)}</p>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <p>Deposit Date :</p>
          <p>{dayjs(currentErp.deposit_date).format(dateFormat)}</p>
        </div>

        <div style={{ flex: "1 1 200px" }}></div>
        <div style={{ flex: "1 1 200px" }}></div>
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "16px",
          fontWeight: 700,
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <p>{translate("Paid")} :</p>
          <p>
            {moneyFormatter({
              amount: currentErp.amount,
              currency_code: currentErp.currency,
            })}
          </p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>{translate("Total")} :</p>
          <p>
            {moneyFormatter({
              amount: currentErp.total,
              currency_code: currentErp.currency,
            })}
          </p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>{translate("Total Paid")} :</p>
          <p>
            {moneyFormatter({
              amount: currentErp.credit,
              currency_code: currentErp.currency,
            })}
          </p>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <p>{translate("Total Remaining")} :</p>
          <p>
            {moneyFormatter({
              amount: currentErp.total - currentErp.credit,
              currency_code: currentErp.currency,
            })}
          </p>
        </div>
      </div>
    </>
  );
}
