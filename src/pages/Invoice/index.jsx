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
      title: translate('Number'),
      dataIndex: 'invoiceRefNo',
    },
    {
      title: translate('Client'),
      dataIndex: ['buyerBusinessName', 'name'],
    },
    {
      title: translate('NTN/CNIC'),
      dataIndex: 'buyerNTNCNIC',
    },
    {
      title: translate('Date'),
      dataIndex: 'invoiceDate',
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-'),
    },
    {
      title: translate('Mode'),
      dataIndex: 'mode',
      render: (mode) => {
        const color = mode === 'production' ? 'green' : 'orange';
        return <Tag color={color}>{mode?.toUpperCase() || 'SANDBOX'}</Tag>;
      },
    },
    {
      title: translate('FbrInvoiceNo'),
      dataIndex: 'FbrInvoiceNo',
      render: (text) => text || 'Not Submitted',
      width: 200,
    },
    {
      title: translate('FBR'),
      dataIndex: 'fbrsubmit',
      render: (fbrsubmit) => {
        const color = fbrsubmit ? 'green' : 'red';
        return <Tag color={color}>{fbrsubmit ? 'Submitted' : 'Pending'}</Tag>;
      },
    },
    {
      title: translate('Sub Total'),
      dataIndex: 'subTotal',
      onCell: () => ({
        style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Tax'),
      dataIndex: 'taxTotal',
      onCell: () => ({
        style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({
        style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' },
      }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        const tag = tagColor(status);
        return (
          <Tag color={tag.color}>
            {tag.icon} {translate(tag.label)?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: translate('Payment'),
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        const tag = tagColor(paymentStatus);
        return (
          <Tag color={tag.color}>
            {tag.icon} {translate(tag.label)?.toUpperCase()}
          </Tag>
        );
      },
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
