import { useEffect } from "react";
import { Row, Col } from "antd";
import useLanguage from "@/locale/useLanguage";
import { useDate, useMoney } from "@/settings";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import useOnFetch from "@/hooks/useOnFetch";
import RecentTable from "./components/RecentTable";
import { selectMoneyFormat } from "@/redux/settings/selectors";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

// Import modern components
import SummaryCard from "./components/SummaryCard";
import PreviewCard from "./components/PreviewCard";
import CustomerPreviewCard from "./components/CustomerPreviewCard";

export default function DashboardModule() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const {
    result: quoteResult,
    isLoading: quoteLoading,
    onFetch: fetchQuotesStats,
  } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: "client" })
  );

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: "invoice", currency }));
      fetchQuotesStats(getStatsData({ entity: "quote", currency }));
      fetchPayemntsStats(getStatsData({ entity: "payment", currency }));
    }
  }, [money_format_settings.default_currency_code]);

  const dataTableColumns = [
    {
      title: translate("Number"),
      dataIndex: "number",
    },
    {
      title: translate("Client"),
      dataIndex: ["client", "name"],
    },
    {
      title: translate("Date"),
      dataIndex: "date",
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate("expired Date"),
      dataIndex: "expiredDate",
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate("Sub Total"),
      dataIndex: "subTotal",
      onCell: () => ({
        style: {
          textAlign: "right",
          whiteSpace: "nowrap",
          direction: "ltr",
        },
      }),
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate("Total"),
      dataIndex: "total",
      onCell: () => ({
        style: {
          textAlign: "right",
          whiteSpace: "nowrap",
          direction: "ltr",
        },
      }),
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate("Status"),
      dataIndex: "status",
    },
  ];

  const dataTableColumnsInvoice = [
    {
      title: translate("FbrInvoiceNo"),
      dataIndex: "FbrInvoiceNo",
      render: (text) => text || "Invoice not Submitted to FBR",
      width: 200,
    },
    {
      title: translate("Client"),
      dataIndex: ["buyerBusinessName", "name"],
    },
    {
      title: translate("Date"),
      dataIndex: "date",
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate("Scenario"),
      dataIndex: "scenarioId",
    },
    {
      title: translate("invoiceRefNo"),
      dataIndex: "invoiceRefNo",
    },
    {
      title: translate("invoiceType"),
      dataIndex: "invoiceType",
    },
    {
      title: translate("Total"),
      dataIndex: "total",
      onCell: () => ({
        style: {
          textAlign: "right",
          whiteSpace: "nowrap",
          direction: "ltr",
        },
      }),
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate("paid"),
      dataIndex: "credit",
      onCell: () => ({
        style: {
          textAlign: "right",
          whiteSpace: "nowrap",
          direction: "ltr",
        },
      }),
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate("Status"),
      dataIndex: "status",
      render: (total) => <span>{translate(total)}</span>,
    },
    {
      title: translate("Payment"),
      dataIndex: "paymentStatus",
      render: (total) => <span>{translate(total)}</span>,
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: "invoice",
      title: translate("Invoices"),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: "quote",
      title: translate("quote"),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: "blue",
            value: item?.percentage,
          }))
        }
      />
    );
  });

  if (money_format_settings) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "32px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            marginBottom: "28px",
            marginTop: "-30px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#0d1b2a",
              marginBottom: "0px",
            }}
          >
            Dashboard Overview
          </h1>
        </div>

        {/* Summary Cards Row */}
        <Row gutter={[24, 24]}>
          <SummaryCard
            title={translate("Invoices")}
            prefix={translate("This month")}
            isLoading={invoiceLoading}
            data={invoiceResult?.total}
            type="invoice"
          />
          <SummaryCard
            title={translate("Quote")}
            prefix={translate("This month")}
            isLoading={quoteLoading}
            data={quoteResult?.total}
            type="quote"
          />
          <SummaryCard
            title={translate("paid")}
            prefix={translate("This month")}
            isLoading={paymentLoading}
            data={paymentResult?.total}
            type="paid"
          />
          <SummaryCard
            title={translate("Unpaid")}
            prefix={translate("Not Paid")}
            isLoading={invoiceLoading}
            data={invoiceResult?.total_undue}
            type="unpaid"
          />
        </Row>

        <div style={{ height: "32px" }} />

        {/* Statistics & Customer Section */}
        <Row gutter={[24, 24]}>
          <Col
            className="gutter-row w-full"
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 18 }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                minHeight: "458px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Row gutter={[24, 24]}>{statisticCards}</Row>
            </div>
          </Col>
          <Col
            className="gutter-row w-full"
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 6 }}
          >
            <CustomerPreviewCard
              isLoading={clientLoading}
              activeCustomer={clientResult?.active}
              newCustomer={clientResult?.new}
            />
          </Col>
        </Row>

        <div style={{ height: "32px" }} />

        {/* Recent Tables Section */}
        <Row gutter={[24, 24]}>
          <Col
            className="gutter-row w-full"
            sm={{ span: 24 }}
            lg={{ span: 12 }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background:
                      "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "999px",
                    marginRight: "12px",
                  }}
                />
                <h3
                  style={{
                    color: "#1f2937",
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  {translate("Recent Invoices")}
                </h3>
              </div>
              <RecentTable
                entity={"invoice"}
                dataTableColumns={dataTableColumnsInvoice}
              />
            </div>
          </Col>

          <Col
            className="gutter-row w-full"
            sm={{ span: 24 }}
            lg={{ span: 12 }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background:
                      "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "999px",
                    marginRight: "12px",
                  }}
                />
                <h3
                  style={{
                    color: "#1f2937",
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  {translate("Recent Quotes")}
                </h3>
              </div>
              <RecentTable
                entity={"quote"}
                dataTableColumns={dataTableColumns}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  } else {
    return <></>;
  }
}
