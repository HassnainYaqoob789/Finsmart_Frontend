import dayjs from 'dayjs';
import { Tag } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { tagColor } from '@/utils/statusTagColor';

import { useMoney, useDate } from '@/settings';
import InvoiceDataTableModule from '@/modules/InvoiceModule/InvoiceDataTableModule';

export default function Invoice() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'invoice';
  const { moneyFormatter } = useMoney();

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['number', 'client.name'];
  const dataTableColumns = [
    {
      title: translate('FbrInvoiceNo'),
      dataIndex: 'FbrInvoiceNo',
      render: (text) => text || 'Invoice not Submitted to FBR',
      width: 200, // Optional: Adjust width for better display
    },
    {
      title: translate('Client'),
      dataIndex: ['buyerBusinessName', 'name'],
    },
    {
      title: translate('Date'),
      dataIndex: 'invoiceDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },

    {
      title: translate('Scenario'),
      dataIndex: 'scenarioId',
    },
    {
      title: translate('invoiceRefNo'),
      dataIndex: 'invoiceRefNo',
    },
    {
      title: translate('invoiceType'),
      dataIndex: 'invoiceType',
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => {
        return moneyFormatter({ amount: total, currency_code: record.currency });
      },
    },
    {
      title: translate('paid'),
      dataIndex: 'credit',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (total, record) => (
        <span>{translate(total)}</span>
      ),

    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      render: (total, record) => (
        <span>{translate(total)}</span>
      ),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    VALIDATE_TO_FBR: translate('validate_to_fbr'),
    ENTITY_NAME: translate('invoice'),
    RECORD_ENTITY: translate('record_payment'),
    SUBMIT_TO_FBR: 'Submit To FBR',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <InvoiceDataTableModule config={config} />;
}
