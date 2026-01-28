import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config.js';

import useLanguage from '@/locale/useLanguage';
import CategoryForm from '@/forms/CategoryForm.jsx';

export default function ProductCategory() {
  const translate = useLanguage();
  const entity = 'category';
  const searchConfig = {
    displayLabels: ['Name'],
    searchFields: 'Name',
  };
  const deleteModalLabels = ['Name'];

  const Labels = {
    PANEL_TITLE: 'Product Category List',
    DATATABLE_TITLE: 'Product Category List',
    ADD_NEW_ENTITY: "Add Product Category",
    ENTITY_NAME: "Product Category",
  };
 

  const readColumns = [
    {
      title: 'HS Code: ',
      dataIndex: 'HS Code',
    },
    {
      title: 'Name: ',
      dataIndex: 'Name',
    },
    {
      title: 'Description: ',
      dataIndex: 'Description',
    },
    {
      title: 'Tax (in %): ',
      dataIndex: 'tax',
    },
  
  ];
  const dataTableColumns = [
    {
      title: 'HS Code',
      dataIndex: 'HS Code',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
    },
    {
      title: 'Description',
      dataIndex: 'Description',
    },
    {
      title: 'Tax',
      dataIndex: 'tax',
      render: (_, record) => {
        return <>{record.tax + '%'}</>;
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
      createForm={<CategoryForm fields={fields} />}
      updateForm={<CategoryForm fields={fields} />}
      config={config}
    />
  );
}
