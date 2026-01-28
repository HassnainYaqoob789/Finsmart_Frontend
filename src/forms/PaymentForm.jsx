import dayjs from 'dayjs';
import { Form, Input, InputNumber, Row, Select } from 'antd';
import { DatePicker } from 'antd';
import { useMoney, useDate } from '@/settings';




let bank_code = [
  {
    "bank_name": "Habib Bank Limited",
    "bank_code": "HBL",
    "swift_code": "HABBPKKA"
  },
  {
    "bank_name": "United Bank Limited",
    "bank_code": "UBL",
    "swift_code": "UNILPKKA"
  },
  {
    "bank_name": "National Bank of Pakistan",
    "bank_code": "NBP",
    "swift_code": "NBPAPKKAXXX"
  },
  {
    "bank_name": "MCB Bank Limited",
    "bank_code": "MCB",
    "swift_code": "MCBLPKKA"
  },
  {
    "bank_name": "Bank Alfalah",
    "bank_code": "BAFL",
    "swift_code": "BAFLPKKA"
  },
  {
    "bank_name": "Bank Islami Pakistan Limited",
    "bank_code": "BIPL",
    "swift_code": "BIPLPKKA"
  },
  {
    "bank_name": "Standard Chartered Bank (Pakistan) Limited",
    "bank_code": "SCBPL",
    "swift_code": "SCBLPKKA"
  },
  {
    "bank_name": "Faysal Bank",
    "bank_code": "FBL",
    "swift_code": "FAYLPKKA"
  },
  {
    "bank_name": "Bank of Punjab",
    "bank_code": "BOP",
    "swift_code": "BOPUPKKA"
  },
  {
    "bank_name": "Allied Bank Limited",
    "bank_code": "ABL",
    "swift_code": "ABLPPKKA"
  },
  {
    "bank_name": "First Women Bank Limited",
    "bank_code": "FWBL",
    "swift_code": "FWBLPKKA"
  },
  {
    "bank_name": "The Bank of Khyber",
    "bank_code": "BOK",
    "swift_code": "BOKUPKKA"
  },
  {
    "bank_name": "Soneri Bank Limited",
    "bank_code": "SBL",
    "swift_code": "SNRIPKKA"
  },
  {
    "bank_name": "Bank Al Habib",
    "bank_code": "BAH",
    "swift_code": "BAHLPKKA"
  },
  {
    "bank_name": "Bank of Azad Jammu & Kashmir",
    "bank_code": "BAJK",
    "swift_code": "BAJKPKKA"
  },
  {
    "bank_name": "First Commercial Bank of China",
    "bank_code": "FCB",
    "swift_code": "FCBLPKKA"
  },
  {
    "bank_name": "Habib Metropolitan Bank",
    "bank_code": "HMB",
    "swift_code": "HMBLPKKA"
  },
  {
    "bank_name": "The Royal Bank of Scotland",
    "bank_code": "RBS",
    "swift_code": "RBOSPKKA"
  },
  {
    "bank_name": "Pak Oman Investment Company",
    "bank_code": "POIC",
    "swift_code": "POICPKKA"
  },
  {
    "bank_name": "National Investment Trust Limited",
    "bank_code": "NIT",
    "swift_code": "NITPKKA"
  },
  {
    "bank_name": "Bank of China",
    "bank_code": "BOC",
    "swift_code": "BKCHPKKA"
  },
  {
    "bank_name": "Citibank",
    "bank_code": "Citi",
    "swift_code": "CITIPKKA"
  },
  {
    "bank_name": "China Development Bank",
    "bank_code": "CDB",
    "swift_code": "CDBLPKKA"
  },
  {
    "bank_name": "Pak Libya Holding Company",
    "bank_code": "PLHC",
    "swift_code": "PLHCPKKA"
  },
  {
    "bank_name": "Summit Bank Limited",
    "bank_code": "SBL",
    "swift_code": "SSTMPKKA"
  },
  {
    "bank_name": "Sindh Bank",
    "bank_code": "SB",
    "swift_code": "SINDPKKA"
  },
  {
    "bank_name": "U Microfinance Bank Limited",
    "bank_code": "UMBL",
    "swift_code": "UMBLPKKA"
  },
  {
    "bank_name": "Mobilink Microfinance Bank",
    "bank_code": "MMBL",
    "swift_code": "MMBLPKKA"
  },
  {
    "bank_name": "FINCA Microfinance Bank",
    "bank_code": "FMFB",
    "swift_code": "FMFBPKKA"
  },
  {
    "bank_name": "First Dawn Microfinance Bank",
    "bank_code": "FDM",
    "swift_code": "FDMMPKKA"
  },
  {
    "bank_name": "FINCORP",
    "bank_code": "FIN",
    "swift_code": "FINCPKKA"
  }
]

const options = bank_code && bank_code.map((bank) => ({
  value: bank.bank_code,
  label: `${bank.bank_name} (${bank.bank_code})`,
}));


export default function PaymentForm({ maxAmount = null}) {
  const { TextArea } = Input;
  const money = useMoney();
  const { dateFormat } = useDate();
  return (
    <>
    <Row>

      
    <Form.Item 
        style={{ width: '70%', float: 'left', paddingRight: '20px' }}
        label={'Cheque / PO No. :'} name="cheque_no">
        <Input placeholder='Enter Cheque / PO No.' />
      </Form.Item>

    
      <Form.Item
        name="cheque_date"
        label={'Cheque Date:'}
        style={{ width: '30%', float: 'left'}}

        rules={[
          {
            required: true,
            type: 'object',
          },
        ]}
        initialValue={dayjs()}
      >
        <DatePicker format={dateFormat} style={{ width: '100%' }} />
      </Form.Item>

      </Row>

      <Row>


      <Form.Item
        label={'Bank Code:'}
        name="bank_code"

        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: '70%', float: 'left', paddingRight: '20px' }}

      >
        <Select showSearch       allowClear
              options={options} placeholder={'Select Bank Code'}
            ></Select>
      </Form.Item>


      <Form.Item

name="deposit_date"
label={'Deposit Date:'}
rules={[
  {
    required: true,
    type: 'object',
  },
]}
style={{ width: '30%', float: 'left' }}

initialValue={dayjs()}

>
<DatePicker format={dateFormat} style={{ width: '100%' }}  />
</Form.Item>

    
     </Row>
<Row>

<Form.Item
        label={'Deposit Bank:'}
        name="deposit_bank"
        style={{ width: '70%', float: 'left', paddingRight: '20px' }}

        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select showSearch allowClear
              options={options} placeholder={'Select Deposit Bank'}
            ></Select>
      </Form.Item>


<Form.Item label={'Amount: '} name="amount" rules={[{ required: true }]}  
              style={{ width: '30%', float: 'left' }}
       
      >
        <InputNumber
          className="moneyInput"
          min={0}
          controls={false}
          max={maxAmount}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
        />
      </Form.Item>

      
    
  

     

</Row>


    
  
      <Form.Item label={'Remarks:'} name="remarks">
        <TextArea />
      </Form.Item>
    </>
  );
}
