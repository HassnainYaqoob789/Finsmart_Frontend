import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config.js';

import useLanguage from '@/locale/useLanguage';
import AdminForm from '@/forms/AdminForm.jsx';

export default function Admin() {
  const translate = useLanguage();
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['email'],
    searchFields: 'email',
  };
  const deleteModalLabels = ['email'];

  const Labels = {
    // PANEL_TITLE: 'Admin List',
    DATATABLE_TITLE: 'Admin List',
    ADD_NEW_ENTITY: "Add Admin",
    ENTITY_NAME: "Admin",
  };
 

  const readColumns = [
    {
      title: 'Name: ',
      dataIndex: 'name',
    },
    {
      title: 'Email: ',
      dataIndex: 'email',
    },
    {
      title: 'NTN: ',
      dataIndex: 'ntn',
    },
    {
      title: 'Address: ',
      dataIndex: 'address',
    },
    {
      title: 'Scenarios: ',
      dataIndex: 'scenarioIds',
    },
    {
      title: 'Sandbox Token: ',
      dataIndex: 'sandbox_token',
    },
    {
      title: 'Production Token: ',
      dataIndex: 'production_token',
    },
  
  ];
  const dataTableColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
         render: (_, record) => {
          return <>{record.name + ' ' + record.surname}</>;
        },
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'NTN',
        dataIndex: 'ntn',
      },
      {
        title: 'Address',
        dataIndex: 'address',
         render: (_, record) => {
          return <>{record.address + ', ' + record.province}</>;
        },
      },
      {
        title: 'Scenarios',
        dataIndex: 'Scenarios',
         render: (_, record) => {
          return <>{record?.scenarioIds && record?.scenarioIds.length > 0 && (
                record?.scenarioIds.map((e) => e.scenarioId).join(', ') 
            )|| 'N/A'}</>;
        },
      },
       {
        title: 'Sandbox Token',
        dataIndex: 'sandbox_token',
         render: (_, record) => {
          return <>{record.Creds && record.Creds.length > 0 && record?.Creds[0]?.sandbox_token || 'N/A'}</>;
        },
      },
      {
        title: 'Production Token',
        dataIndex: 'production_token',
         render: (_, record) => {
          return <>{record.Creds && record.Creds.length > 0 && record?.Creds[0]?.production_token || 'N/A'}</>;
        },
      },
       
  ];

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
      createForm={<AdminForm fields={fields} />}
      updateForm={<AdminForm fields={fields} />}
      config={config}
    />
  );
}
