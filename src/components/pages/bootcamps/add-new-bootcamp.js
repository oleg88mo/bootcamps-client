import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox} from 'antd';
import {URL} from '../../../configKey';
import {openNotification} from '../../utils/usedFunctions';

function AddNewBootcamp(p) {
    const {locale} = p;
    const {getFieldDecorator, getFieldsError} = p.form;
    const {Option} = Select;
    const {TextArea} = Input;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

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
                    .then(() => {
                        setLoading(false);
                        setDisabled(false);
                        openNotification('success', `${locale.create_new_bootcamp}`, `${locale.bootcamp_was_created}`);
                        handlerReset();
                    })
                    .catch(error => {
                        openNotification('error', `${locale.create_new_bootcamp}`,error.response && error.response.data.error);
                        setLoading(false);
                        setDisabled(false);
                    });
            }
        });
    };

    const handlerReset = () => p.form.resetFields();

    return (
        <div>
            <h1>{locale.add_new_bootcamp} Bootcamp</h1>
            <h3>{locale.add_new_bootcamp_important}</h3>
            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item label={locale.name}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: locale.message_enter_name}],
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_name}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.address}>
                            {getFieldDecorator('address', {
                                rules: [{required: true, message: locale.message_enter_address}],
                            })(
                                <Input
                                    prefix={<Icon type="home" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_address}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.website}>
                            {getFieldDecorator('website')(
                                <Input
                                    prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_website}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.email}>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: locale.not_valid_email,
                                    }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_email}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('housing', {
                                initialValue: false
                            })(
                                <Checkbox>{locale.housing}</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobAssistance', {
                                initialValue: false
                            })(
                                <Checkbox>{locale.job_assistance}</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={locale.careers}
                            hasFeedback
                        >
                            {getFieldDecorator('careers', {
                                rules: [{required: true, message: locale.message_enter_careers}],
                            })(
                                <Select
                                    placeholder={locale.select_careers}
                                    mode="tags"
                                >
                                    <Option value="Web Development">Web Development</Option>
                                    <Option value="Mobile Development">Mobile Development</Option>
                                    <Option value="UI/UX">UI/UX</Option>
                                    <Option value="Data Science">Data Science</Option>
                                    <Option value="Business">Business</Option>
                                    <Option value="Other">{locale.other}</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.phone}>
                            {getFieldDecorator('phone')(
                                <Input
                                    prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_phone}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.description}>
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: locale.message_enter_description}],
                            })(
                                <TextArea rows={5} placeholder={locale.enter_description}/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobGuarantee', {
                                initialValue: false
                            })(
                                <Checkbox>{locale.job_guarantee}</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('acceptGi', {
                                initialValue: false
                            })(
                                <Checkbox>{locale.accepts_gi_bill}</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <span>*{locale.after_add_bootcamp}</span>
                    <Button style={{marginRight: 8}} onClick={handlerReset}>{locale.clear}</Button>
                    <Button type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        {locale.add_new_bootcamp} Bootcamp
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(AddNewBootcamp);
export default WrappedNormalLoginForm;
