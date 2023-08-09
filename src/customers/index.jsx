import React , {useState,useEffect} from 'react';
import axios from 'axios';
import { Row, Space, Button, Select, Card, Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons'

const { Option } = Select;

const Customers = () => {
    const [customerList, setCustomerList]= useState([]);   //state to store customer data
    const [currentCustomer, setCurrentCustomer]= useState("");  // state to store customer selected to edit/view
    const [isModalVisible, setIsModalVisible]= useState(false);  //state to check whether to open/close pop up modal

    const [form]=Form.useForm()

    useEffect(()=>{
        // using axios to retirieve customer data from the API
        axios.get('https://waveaccounting.github.io/se-challenge-fe-customers/settings.json')
        .then(response=>{
            if(response.data && response.data.customers){
                setCustomerList(response.data.customers)
            }
        })
        // catch error if some error occurs while loading data
        .catch(err=>{
            console.log("Error while loading data, please try later",err)
        })
    },[])

    const handleCustomerEdit=(customerId)=>{
        const cust = customerList.find(item=>item.id===customerId)
        setCurrentCustomer(cust);
        setIsModalVisible(true);
        form.setFieldsValue(cust) //store the initial selected customer data

    }
    const handleCancel=()=>{
        setIsModalVisible(false)
    }
    const handleSubmit=()=>{
        //check if the form has passed the validation checks
        form.validateFields().then(values=>{

            // update the customer fields
            const updatedCustomers = customerList.map(customer=>{
                if(customer.id===currentCustomer.id){
                    return {...customer,...values}
                }
                return customer;
            })
            setCustomerList(updatedCustomers);
            setIsModalVisible(false);
            message.success("Details updated successfully.")
        })
        // catch error if form validation has failed
        .catch(err=>{
            console.log("Please enter the required fields properly", err)
            message.error("Please enter the required fields properly.");
        })

    }

  return (
    <>
    <h2> Customers List Wave</h2>
    <Space direction="vertical" size={18}>
    <Row gutter={18}>
   { customerList.map(customer=>
    <Card title ={customer.name} key={customer.id} value={customer.name} className='card-title' extra={
        <Button type="link" icon={<EditOutlined />} onClick={() => handleCustomerEdit(customer.id)}>
        </Button>}>
   <p>Email: {customer.email}</p>
    <p>Channel: {customer.channel}</p>
    <p >Country: {customer.country}</p>
    <p >City: {customer.city}</p>
    </Card>)
   }
    </Row>
    </Space>
    {isModalVisible && currentCustomer &&
    <Modal
    open={isModalVisible}
    onCancel={handleCancel}
    title={<h2 className='edit-title'>Edit Customer</h2>}
    onOk={handleSubmit}
    >
    <Form form={form} initialValues={currentCustomer}>
    <Form.Item label="Name"  labelCol={{span:8}} wrapperCol={{span:12}} name ="name" rules={[{required:"true", message:"Name is required"}]}>
    <Input/>
    </Form.Item>
    <Form.Item label="Email" labelCol={{span:8}} wrapperCol={{span:12}} name="email" rules={[{required:"true", message:"Email is required."},{type:"email",message:"Please enter a valid email."}]}>
    <Input/>
    </Form.Item>
    <Form.Item label="Channel" name="channel"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Select placeholder="Choose channel">
    <Option value="website">Website</Option>
    <Option value="phone">Phone</Option>
    <Option value="other">Other</Option>
    </Select>
    </Form.Item>
    <Form.Item label="Country" name="country"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Input/>
    </Form.Item>
    <Form.Item label="Address" name="address"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Input/>
    </Form.Item>
    <Form.Item label="Postal" name="postal"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Input/>
    </Form.Item>
    <Form.Item label="City" name="city"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Input/>
    </Form.Item>
    <Form.Item label="Province" name="province"  labelCol={{span:8}} wrapperCol={{span:12}}>
    <Input/>
    </Form.Item>

    </Form>
    </Modal>
}
   </>
  )
}

export default Customers;