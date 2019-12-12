import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Button, Select, notification} from 'antd';
import {URL} from '../../../configKey';
import UpdatePassword from './updatePassword';
import {useSelector} from "react-redux";

function MyInformation(p) {
    const {getFieldDecorator, getFieldsError} = p.form;
    const me = useSelector(state => state.Users.me);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userInformation, setUserInformation] = useState(me);
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

                data && axios.put(`${URL}/users/${userInformation.id}`, data, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setLoading(false);
                        setDisabled(false);
                        openNotificationWithIcon('success', 'User Information was updated');
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response.data.error);
                        setLoading(false);
                        setDisabled(false);
                    });
            }
        });
    };

    return (
        <div>
            <h1>User Information</h1>

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={24}>
                        <Form.Item label="role">
                            <Select
                                placeholder="Please select a Careers"
                                disabled
                                value={userInformation.role && userInformation.role}
                            />
                        </Form.Item>
                        <Form.Item label="Name">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: 'Please input your name!'}],
                                initialValue: userInformation.name,
                            })(<Input
                                onChange={(e) => setUserInformation({
                                    ...userInformation,
                                    'name': e.target.value
                                })}
                            />)}
                        </Form.Item>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {type: 'email', message: 'The input is not valid E-mail!'},
                                    {required: true, message: 'Please input your E-mail!'},
                                ],
                                initialValue: userInformation.email,
                            })(<Input
                                onChange={(e) => setUserInformation({
                                    ...userInformation,
                                    'email': e.target.value
                                })}
                            />)}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <Button
                        type="primary"
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
