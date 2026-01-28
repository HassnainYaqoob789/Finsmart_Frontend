import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { Button, Row, Col, Descriptions, Tag, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { generate as uniqueId } from 'shortid';
import { useMoney, useDate } from '@/settings';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import UpdatePayment from './UpdatePayment';

export default function Payment({ config, currentItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;

  const money = useMoney();
  const navigate = useNavigate();
  const { dateFormat } = useDate();

  const [currentErp, setCurrentErp] = useState(currentItem);

  useEffect(() => {
    const controller = new AbortController();
    if (currentItem) {
      const { invoice, _id, ...others } = currentItem;
      setCurrentErp({ ...others, ...invoice, _id });
    }
    return () => controller.abort();
  }, [currentItem]);

  const [client, setClient] = useState({});

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 20, push: 2 }}
        >
          <PageHeader
            onBack={() => navigate(`/${entity.toLowerCase()}`)}
            title={`Update ${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`}
            ghost={false}
            tags={<span style={{background:currentErp.paymentStatus === 'unpaid' ? "yellow" : 'lightgreen', padding:"4px 8px", borderRadius:'50px',  fontSize:'12px'}}>{currentErp.paymentStatus && translate(currentErp.paymentStatus)}</span>}            // subTitle="This is cuurent erp page"
            extra={[
              <Button
                key={`${uniqueId()}`}
                onClick={() => {
                  navigate(`/${entity.toLowerCase()}`);
                }}
                icon={<CloseCircleOutlined />}
              >
                {translate('Cancel')}
              </Button>,
              <Button
                key={`${uniqueId()}`}
                onClick={() => navigate(`/invoice/read/${currentErp._id}`)}
                icon={<FileTextOutlined />}
              >
                {translate('Show invoice')}
              </Button>,
            ]}
            style={{
              padding: '20px 0px',
            }}
          ></PageHeader>
          <Divider dashed />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 10, order: 2, push: 2 }}
          lg={{ span: 10, order: 2, push: 2 }}
        >
          <div className="space50"></div>
          <Descriptions title={`${translate('Client')} : ${currentErp.client.name}`} column={1}>
          <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
            <Descriptions.Item label={translate('phone')}>{client.phone}</Descriptions.Item>
            <Divider dashed />
            <Descriptions.Item label={"Invoice Date"}>{dayjs(currentErp.date).format(dateFormat)}</Descriptions.Item>

            <Descriptions.Item label={translate('payment status')}>
              <span>{currentErp.paymentStatus && translate(currentErp.paymentStatus)}</span>
            </Descriptions.Item>

            {/* <Descriptions.Item label={translate('SubTotal')}>
              {money.moneyFormatter({
                amount: currentErp.subTotal,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item> */}
            <Descriptions.Item label={translate('Total')}>
              {money.moneyFormatter({
                amount: currentErp.total,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Discount">
              {money.moneyFormatter({
                amount: currentErp.discount,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item> */}
            <Descriptions.Item label="Paid">
              {money.moneyFormatter({
                amount: currentErp.credit,
                currency_code: currentErp.currency,
              })}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 14, order: 1 }}
        >
          <UpdatePayment config={config} currentInvoice={currentErp} />
        </Col>
      </Row>
    </>
  );
}
