import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, notification} from 'antd';
import {URL} from '../../../configKey';
import UpdatePassword from './updatePassword';

function MyInformation(p) {
    const {getFieldDecorator, getFieldsError} = p.form;
    const {Option} = Select;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: 'Create New Bootcamp',
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
            <h1>User Information</h1>

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={24}>
                        <Form.Item label="role">
                            <Select placeholder="Please select a Careers" disabled/>
                        </Form.Item>
                        <Form.Item label="name">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        type: 'name',
                                        message: 'The input name .....',
                                    }
                                ],
                                // initialValue: elementState.email,
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="name"
                                    // onChange={(e) => setElementState({
                                    //     ...elementState,
                                    //     'email': e.target.value
                                    // })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="email">
                            <Input
                                prefix={<Icon type="email" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="email"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <Button style={{marginRight: 8}} onClick={handlerReset}>Clear</Button>
                    <Button type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        Update Information
                    </Button>
                </footer>
            </Form>

            <UpdatePassword/>

        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(MyInformation);

export default WrappedNormalLoginForm;