import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox, notification} from 'antd';
import {URL} from '../../../configKey';

function AddNewBootcamp(p) {
    const {getFieldDecorator, getFieldsError} = p.form;
    const {Option} = Select;
    const {TextArea} = Input;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: '/login',
            description
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        p.form.validateFields((err, values) => {
            if (!err) {
                setLoading(true);
                setDisabled(true);
                const isLoggin = window.localStorage.getItem('bootcampAuthToken');
                const tokenRemoveFirstChar = isLoggin.substr(1);
                const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                const removeEmpty = obj => {
                    Object.keys(obj).forEach(key => {
                        return (obj[key] === undefined) && delete obj[key]
                    });

                    return obj;
                };
                const data = removeEmpty(values);

                data && axios.post(`${URL}/bootcamps`, data, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setLoading(false);
                        setDisabled(false);
                        openNotificationWithIcon('success', 'Bootcamp created');
                        handlerReset();
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response.data.error);
                        setLoading(false);
                        setDisabled(false);
                    });
            }
        });
    };
    const handlerReset = () => p.form.resetFields();

    return (
        <div>
            <h1>Add Bootcamp</h1>
            <h3>Important: You must be affiliated with a bootcamp to add to DevCamper</h3>
            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item label="Name">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: 'Please input your name!'}],
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Name"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Address">
                            {getFieldDecorator('address', {
                                rules: [{required: true, message: 'Please input your address!'}],
                            })(
                                <Input
                                    prefix={<Icon type="home" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="address"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Website">
                            {getFieldDecorator('website')(
                                <Input
                                    prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Website"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('housing', {
                                initialValue: false
                            })(
                                <Checkbox>Housing</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobAssistance', {
                                initialValue: false
                            })(
                                <Checkbox>Job Assistance</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobGuarantee', {
                                initialValue: false
                            })(
                                <Checkbox>Job Guarantee</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('acceptGi', {
                                initialValue: false
                            })(
                                <Checkbox>Accepts GI Bill</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Careers" hasFeedback>
                            {getFieldDecorator('careers', {
                                rules: [{required: true, message: 'Please select your country!'}],
                            })(
                                <Select placeholder="Please select a Careers" mode="tags">
                                    <Option value="Web Development">Web Development</Option>
                                    <Option value="Mobile Development">Mobile Development</Option>
                                    <Option value="UI/UX">UI/UX</Option>
                                    <Option value="Data Science">Data Science</Option>
                                    <Option value="Business">Business</Option>
                                    <Option value="Other">Other</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="Phone">
                            {getFieldDecorator('phone')(
                                <Input
                                    prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Phone"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: 'Please input your description!'}],
                            })(
                                <TextArea rows={5} placeholder="Enter your Description here..."/>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <span>*After you add the bootcamp, you can add the specific courses offered</span>
                    <Button style={{marginRight: 8}} onClick={handlerReset}>Clear</Button>
                    <Button type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        Add New Bootcamp
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(AddNewBootcamp);

export default WrappedNormalLoginForm;