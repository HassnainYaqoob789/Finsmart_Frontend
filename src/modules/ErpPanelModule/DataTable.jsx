import { useEffect } from "react";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Dropdown, Table, Button, message, Modal } from "antd"; // Added Modal import
import { PageHeader } from "@ant-design/pro-layout";
import axios from "axios";

import AutoCompleteAsync from "@/components/AutoCompleteAsync";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import { erp } from "@/redux/erp/actions";
import { selectListItems } from "@/redux/erp/selectors";
import { useErpContext } from "@/context/erp";
import { generate as uniqueId } from "shortid";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL, DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";

function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  return (
    <Button
      onClick={handleClick}
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
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } =
    useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  const authData = useSelector((state) => state.auth); // Assuming auth state is available in Redux

  console.log("listResult", listResult);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: "update", data }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record) => {
    window.open(
      `${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`,
      "_blank"
    );
  };
  const handleDelete = (record) => {
    // Replaced custom modal with Ant Design's Modal.confirm for reliable handling
    Modal.confirm({
      title: translate("Confirm Delete"),
      content: translate("Are you sure you want to delete this record?"),
      okText: translate("Delete"),
      okType: "danger",
      cancelText: translate("Cancel"),
      onOk: async () => {
        try {
          // Assuming erp.delete action exists; if not, replace with axios.delete
          await dispatch(erp.delete({ entity, id: record._id })).unwrap(); // Use .unwrap() if using RTK Query
          message.success(translate("Record deleted successfully"));
          dispatch(erp.list({ entity })); // Refresh the list
        } catch (error) {
          console.error("Delete error:", error);
          message.error(translate("Failed to delete record"));
        } finally {
          // Ensure body overflow is reset (extra safety)
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }
      },
      onCancel: () => {
        // Reset body styles on cancel
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      },
      afterClose: () => {
        // Clean up after modal closes
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      },
    });
  };
  const handleRecordPayment = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record._id}`);
  };
  const handleFbrSubmit = async (record) => {
    try {
      // Transform items to match FBR API requirements
      const fbrItems = record.items.map(({ item, ...rest }) => ({
        ...rest,
        item: item._id,
        productDescription: item["Product Name"],
      }));

      // Prepare payload for FBR API
      const payload = {
        invoiceType: record.invoiceType,
        invoiceDate: record.invoiceDate
          ? new Date(record.invoiceDate).toISOString().split("T")[0]
          : new Date(),
        sellerBusinessName: record.sellerBusinessName,
        sellerProvince: record.sellerProvince,
        sellerNTNCNIC: record.sellerNTNCNIC,
        sellerAddress: record.sellerAddress,
        buyerNTNCNIC: record.buyerNTNCNIC,
        buyerBusinessName:
          record.buyerBusinessName?.name || record.buyerBusinessName,
        buyerProvince: record.buyerProvince,
        buyerAddress: record.buyerAddress,
        invoiceRefNo: record.invoiceRefNo,
        buyerRegistrationType: record.buyerRegistrationType,
        scenarioId: record.scenarioId,
        items: fbrItems,
      };

      console.log("FBR API payload:", payload);

      // Make API call to submit to FBR
      const response = await axios.post(
        `${API_BASE_URL}user-fbr/digital_invoice`,
        payload,
        {
          headers: { Authorization: `Bearer ${authData?.current?.token}` },
        }
      );

      if (
        response.data.success &&
        response.data.result.validationResponse.status === "Valid"
      ) {
        console.log("FBR Invoice Number:", response.data.result.invoiceNumber);
        message.success(
          translate("Invoice successfully submitted to FBR!"),
          10
        );

        // Transform items for updatedRecord, removing _id and tax from each item
        const updatedItems = record.items.map(
          ({ item, _id, tax, ...rest }) => ({
            ...rest,
            item: item._id,
          })
        );

        // Create updatedRecord, removing specified fields
        const {
          _id,
          removed,
          createdBy,
          taxRate,
          subTotal,
          isOverdue,
          approved,
          status,
          updated,
          created,
          __v,
          pdf,
          taxTotal,
          currency,
          credit,
          discount,
          payment,
          paymentStatus,
          ...restRecord
        } = record;
        const updatedRecord = {
          ...restRecord,
          FbrInvoiceNo: response.data.result.invoiceNumber,
          buyerBusinessName:
            record.buyerBusinessName?._id || record.buyerBusinessName,
          items: updatedItems,
        };

        // Update Redux state
        dispatch(
          erp.currentAction({ actionType: "update", data: updatedRecord })
        );

        // Make PATCH request to update the invoice in the backend
        try {
          const patchResponse = await axios.patch(
            `${API_BASE_URL}invoice/update/${record._id}`,
            updatedRecord,
            {
              headers: { Authorization: `Bearer ${authData?.current?.token}` },
            }
          );

          if (patchResponse.data.success) {
            message.success(
              translate("Invoice updated with FBR Invoice Number!"),
              10
            );
            // Refresh table data by calling the GET API
            dispatch(erp.list({ entity }));
          } else {
            message.error(
              translate("Failed to update invoice with FBR Invoice Number"),
              10
            );
          }
        } catch (patchError) {
          console.error("Error updating invoice:", patchError);
          message.error(
            translate(
              "Failed to update invoice due to a network or server error"
            ),
            10
          );
        }
      } else {
        const errorMessage =
          response.data.result.validationResponse.error ||
          response.data.result.validationResponse.invoiceStatuses?.[0]?.error ||
          response.data.message ||
          "Unknown error";
        message.error(
          translate("Failed to submit invoice to FBR: " + errorMessage),
          10
        );
      }
    } catch (error) {
      console.error("Error submitting invoice to FBR:", error);
      message.error(
        translate("Failed to process invoice due to a network or server error"),
        10
      );
    }
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: "",
      key: "action",
      fixed: "right",
      render: (_, record) => {
        // Conditionally include "Submit To FBR" and its divider
        const items = [
          ...(record.FbrInvoiceNo === ""
            ? [
              {
                label: "Submit To FBR",
                key: "fbr",
                icon: <EyeOutlined />,
              },
              {
                type: "divider",
              },
            ]
            : []),
          {
            label: translate("Show"),
            key: "read",
            icon: <EyeOutlined />,
          },
          ...(record.FbrInvoiceNo === ""
            ? [
              {
                label: translate("Edit"),
                key: "edit",
                icon: <EditOutlined />,
              },
            ]
            : []),
          {
            label: translate("Download"),
            key: "download",
            icon: <FilePdfOutlined />,
          },
          ...extra,
          {
            type: "divider",
          },
          {
            label: translate("Delete"),
            key: "delete",
            icon: <DeleteOutlined />,
          },
        ];

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case "read":
                    handleRead(record);
                    break;
                  case "edit":
                    handleEdit(record);
                    break;
                  case "download":
                    handleDownload(record);
                    break;
                  case "delete":
                    handleDelete(record);
                    break;
                  case "recordPayment":
                    handleRecordPayment(record);
                    break;
                  case "fbr":
                    handleFbrSubmit(record);
                    break;
                  default:
                    break;
                }
                console.log(record);
              },
            }}
            trigger={["click"]}
          >
            <EllipsisOutlined
              style={{ cursor: "pointer", fontSize: "24px" }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const handelDataTableLoad = (pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize,
    };
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const filterTable = (value) => {
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erp.list({ entity, options }));
  };

  // Added global cleanup effect for safety (in case custom modal is still used elsewhere)
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <AutoCompleteAsync
            key={`${uniqueId()}`}
            entity={searchConfig?.entity}
            displayLabels={["name"]}
            searchFields={"name"}
            onChange={filterTable}
          />,
          <Button
            onClick={handelDataTableLoad}
            key={`${uniqueId()}`}
            icon={<RedoOutlined />}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#1565C0",
              color: "#FFFFFF",
            }}
          >
            {translate("Refresh")}
          </Button>,
          !disableAdd && <AddNewItem config={config} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        style={{ marginTop: "30px" }}
        pagination={{
          ...pagination,
          position: ["bottomCenter"], // 👈 centers the pagination
        }}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}