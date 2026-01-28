import React from 'react';

import useLanguage from '@/locale/useLanguage';

import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentMode';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };

  const deleteModalLabels = ['name'];

  const readColumns = [
    {
      title: 'Bank Code',
      dataIndex: 'bank_code',
    },
    {
      title: 'Deposit Bank',
      dataIndex: 'deposit_bank',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Bank Code',
      dataIndex: 'bank_code',
    },
    {
      title: 'Deposit Bank',
      dataIndex: 'deposit_bank',
    },
   
  ];

  const Labels = {
    PANEL_TITLE: 'Bank List',
    DATATABLE_TITLE: 'Bank List',
    ADD_NEW_ENTITY: 'Add Bank List',
    ENTITY_NAME: 'Bank List',
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    readColumns,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<PaymentModeForm />}
      updateForm={<PaymentModeForm isUpdateForm={true} />}
      config={config}
    />
  );
}
