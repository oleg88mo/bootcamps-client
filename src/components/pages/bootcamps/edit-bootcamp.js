import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox, notification} from 'antd';
import {URL} from '../../../configKey';

function EditBootcamp(p) {
    const {locale} = p;
    const el = p.element;

    const {getFieldDecorator, getFieldsError} = p.form;
    const {Option} = Select;
    const {TextArea} = Input;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [elementState, setElementState] = useState(el);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: `${locale.add_new_bootcamp} Bootcamp`,
            description
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        p.form.validateFields((err) => {
            if (!err) {
                setLoading(true);
                setDisabled(true);
                const isLoggin = window.localStorage.getItem('bootcampAuthToken');
                const tokenRemoveFirstChar = isLoggin.substr(1);
                const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                axios.put(`${URL}/bootcamps/${el.id}`, elementState, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(() => {
                        p.handlerReloadBootcamp()
                        setLoading(false);
                        setDisabled(false);
                        openNotificationWithIcon('success', `Bootcamp ${locale.bootcamp_was_updated}`);
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response && error.response.data.error);
                        setLoading(false);
                        setDisabled(false);
                    });
            }
        });
    };

    return (
        <div className="edit-bootcamp">
            <h1>{locale.edit_new_bootcamp} Bootcamp</h1>

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item label={locale.name}>
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: locale.message_enter_name}],
                                initialValue: elementState.name,
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_name}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'name': e.target.value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.address}>
                            {getFieldDecorator('address', {
                                rules: [{required: true, message: locale.message_enter_address}],
                                initialValue: elementState.location.formattedAddress,
                            })(
                                <Input
                                    prefix={<Icon type="home" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_address}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'location': {
                                            ...elementState.location,
                                            'formattedAddress': e.target.value
                                        }
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.website}>
                            {getFieldDecorator('website', {
                                initialValue: elementState.website,
                            })(
                                <Input
                                    prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.enter_website}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'website': e.target.value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.email}>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    }
                                ],
                                initialValue: elementState.email,
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Email"
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'email': e.target.value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('housing')(
                                <Checkbox
                                    checked={elementState.housing}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'housing': e.target.checked
                                    })}
                                >Housing</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobAssistance')(
                                <Checkbox
                                    checked={elementState.jobAssistance}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'jobAssistance': e.target.checked
                                    })}
                                >Job Assistance</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('jobGuarantee')(
                                <Checkbox
                                    checked={elementState.jobGuarantee}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'jobGuarantee': e.target.checked
                                    })}
                                >Job Guarantee</Checkbox>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('acceptGi')(
                                <Checkbox
                                    checked={elementState.acceptGi}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'acceptGi': e.target.checked
                                    })}
                                >Accepts GI Bill</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Careers" hasFeedback>
                            {getFieldDecorator('careers', {
                                rules: [{required: true, message: 'Please select your country!'}],
                                initialValue: elementState.careers,
                            })(
                                <Select placeholder="Please select a Careers" mode="tags"
                                        onChange={value => setElementState({
                                            ...elementState,
                                            'careers': value
                                        })}>
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
                            {getFieldDecorator('phone', {
                                initialValue: elementState.phone,
                            })(
                                <Input
                                    prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Phone"
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'phone': e.target.value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: 'Please input your description!'}],
                                initialValue: elementState.description,
                            })(
                                <TextArea rows={5} placeholder="Enter your Description here..."
                                          onChange={(e) => setElementState({
                                              ...elementState,
                                              'description': e.target.value
                                          })}/>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <footer>
                    <Button type="primary"
                            htmlType="submit"
                            style={{marginBottom: 15}}
                            loading={loading}
                            disabled={hasErrors(getFieldsError()) || disabled}
                    >
                        Update Bootcamp
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(EditBootcamp);

export default WrappedNormalLoginForm;