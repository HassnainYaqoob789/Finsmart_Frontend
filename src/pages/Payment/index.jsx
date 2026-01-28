import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import PaymentDataTableModule from '@/modules/PaymentModule/PaymentDataTableModule';

import { useMoney, useDate } from '@/settings';

export default function Payment() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  const searchConfig = {
    entity: 'client',
    displayLabels: ['number'],
    searchFields: 'number',
    outputValue: '_id',
  };

  const deleteModalLabels = ['number'];
  const dataTableColumns = [
    // {
    //   title: translate('Number'),

    //   dataIndex: 'number',
    // },
    {
      title: 'Invoice No.',
      dataIndex: ['invoice', 'FbrInvoiceNo'],
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },
    {
      title: 'Cheque No.',
      dataIndex: ['cheque_no'],
    },
  
    
    {
      title: 'Bank Code',
      dataIndex: ['bank_code'],
    },
    {
      title: 'Cheque Date',
      dataIndex: 'cheque_date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },

    {
      title: 'Deposit Bank',
      dataIndex: ['deposit_bank'],
    },
    {
      title:'Deposit Date',
      dataIndex: 'deposit_date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('Amount'),
      dataIndex: 'amount',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (amount, record) =>
        moneyFormatter({ amount: amount, currency_code: record.currency }),
    },
   
   
    // {
    //   title: translate('year'),
    //   dataIndex: ['invoice', 'year'],
    // },
    // {
    //   title: 'Remarks',
    //   dataIndex: ['remarks'],
    // },
  ];

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    disableAdd: true,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <PaymentDataTableModule config={config} />;
}
