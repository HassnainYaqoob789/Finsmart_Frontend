import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config.js';

import useLanguage from '@/locale/useLanguage';
import ProductForm from '@/forms/ProductForm.jsx';

export default function Product() {
  const translate = useLanguage();
  const entity = 'product';
  const searchConfig = {
    displayLabels: ['Product Name'],
    searchFields: 'Product Name',
  };
  const deleteModalLabels = ['Product Name'];

  const Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: 'Product List',
    ADD_NEW_ENTITY: "Add Product",
    ENTITY_NAME: "Product",
  };
 

  const readColumns = [
    {
      title: 'Product Name: ',
      dataIndex: 'Product Name',
    },
 
    {
      title: 'Category: ',
      dataIndex: 'category',
    },
    {
      title: 'UOM (Unit of Measure): ',
      dataIndex: 'uom',
    },
  
  ];
  const dataTableColumns = [
    {
        title: 'Product Name',
        dataIndex: 'Product Name',
      },

      {
        title: 'Category',
        dataIndex: ['category', 'Name'],
      },
  
      {
        title: 'UOM (Unit of Measure)',
        dataIndex: 'uom',
      }    
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
      createForm={<ProductForm fields={fields} />}
      updateForm={<ProductForm fields={fields} />}
      config={config}
    />
  );
}
