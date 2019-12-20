import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {URL} from '../../../configKey';
import {Form, Input, Checkbox, Radio, Button, Icon, Modal} from 'antd';
import {openNotification, req} from '../../utils/usedFunctions';

function Register(p) {
    const {locale, form} = p;
    const {getFieldDecorator, getFieldsError} = form;

    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [agree, setAgree] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const [visible, setVisible] = useState(false);
    const [role, setRole] = useState('user');

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const handlerRegister = e => {
        e.preventDefault();

        form.validateFieldsAndScroll(err => {
            if (!err) {
                const options = {
                    data: {name, email, password, role},
                    url: `${URL}/auth/register`,
                    method: 'post',
                };

                req(options).then(
                    response => {
                        if (response && response.data) {
                            window.localStorage.setItem('bootcampAuthToken', JSON.stringify(response.data.token));
                            window.location = '/';
                        }
                    },
                    error => {
                        openNotification('error', '/register', error.response && error.response.data.error)
                    }
                )
            }
        });
    };

    const handleConfirmBlur = e => {
        const {value} = e.target;

        setConfirmDirty(confirmDirty || !!value)
    };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords is inconsistent!');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, next) => {
        if (value && value.length > 5 && confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        next();
    };

    const showModal = () => setVisible(true);

    const handleOk = () => setVisible(false);

    const onChange = e => setAgree(e.target.checked);

    const handlerChangeRole = e => setRole(e.target.value);

    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 10},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 14},
        },
    };

    useEffect(() => {
        form.validateFields();
    }, []);

    return (
        <div className="register-form-center">
            <div className="register-form">
                <h2><Icon type="user"/> {locale.register}</h2>
                <Form
                    {...formItemLayout}
                    onSubmit={handlerRegister}
                >
                    <Form.Item label={locale.name}>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: locale.message_enter_name,
                                },
                            ],
                        })(<Input
                            onChange={e => setName(e.target.value !== "" ? e.target.value : null)}
                        />)}
                    </Form.Item>
                    <Form.Item label={locale.email}>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: locale.not_valid_email,
                                },
                                {
                                    required: true,
                                    message: locale.enter_email,
                                },
                            ],
                        })(<Input
                            onChange={e => setEmail(e.target.value !== "" ? e.target.value : null)}
                        />)}
                    </Form.Item>
                    <Form.Item
                        label={locale.password}
                        hasFeedback={password && password.length > 5}
                    >
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: locale.message_enter_password,
                                },
                                {
                                    validator: validateToNextPassword,
                                },
                            ],
                        })(<Input.Password
                            onChange={e => setPassword(e.target.value !== "" ? e.target.value : null)}
                        />)}
                    </Form.Item>
                    <Form.Item
                        label={locale.confirm_password}
                        hasFeedback
                    >
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: locale.message_enter_confirm_password,
                                },
                                {
                                    validator: compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={handleConfirmBlur}/>)}
                    </Form.Item>
                    <Form.Item label={locale.use_your_role}>
                        {getFieldDecorator('role', {
                            valuePropName: 'checked',
                        })(<>
                            <Radio.Group onChange={handlerChangeRole} value={role}>
                                <Radio value="user">{locale.role_user}</Radio>
                                <Radio value="publisher">{locale.author} Bootcamp</Radio>
                            </Radio.Group>
                        </>)}
                    </Form.Item>
                    <Form.Item className="full-center">
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                        })(<>
                            <Checkbox onChange={onChange}>{locale.read_the}</Checkbox>
                            <Button onClick={showModal} className="btn-agreement">{locale.agreement}</Button>
                        </>)}
                    </Form.Item>
                    <Form.Item className="full-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError()) || !agree}
                        >
                            {locale.register}
                        </Button>
                        <br/>
                        {locale.or} <Link to="/login">{locale.login}!</Link>
                    </Form.Item>
                </Form>
                <Modal
                    title="Basic Modal"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleOk}
                >
                    <p>Some contents...</p>
                </Modal>
            </div>
        </div>
    )
}

const WrappedRegistrationForm = Form.create({name: 'register'})(Register);

export default WrappedRegistrationForm;
