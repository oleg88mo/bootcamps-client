import React, {useState} from "react";
import axios from 'axios';
import {Row, Col, Form, Input, Icon, Button, Select, Checkbox, notification, InputNumber} from 'antd';
import {URL} from '../../../configKey';

function EditCourse(p) {
    const el = p.element;
    const {form, locale, handlerReloadCourse} = p;
    const {getFieldDecorator, getFieldsError} = form;
    const {Option} = Select;
    const {TextArea} = Input;

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [elementState, setElementState] = useState(el);

    const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    const openNotificationWithIcon = (type, description) => {
        notification[type]({
            message: 'Create New Course',
            description
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        form.validateFields((err) => {
            if (!err) {
                setLoading(true);
                setDisabled(true);
                const isLoggin = window.localStorage.getItem('bootcampAuthToken');
                const tokenRemoveFirstChar = isLoggin.substr(1);
                const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

                axios.put(`${URL}/courses/${el._id}`, elementState, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(() => {
                        handlerReloadCourse();
                        setLoading(false);
                        setDisabled(false);
                        openNotificationWithIcon('success', `Course ${locale.was_updated}`);
                    })
                    .catch(() => {
                        setLoading(false);
                        setDisabled(false);
                    });
            }
        });
    };

    return (
        <div className="edit-course">
            <h1>{locale.edit} Course</h1>

            <Form onSubmit={handleSubmit}>
                <Row type="flex">
                    <Col span={12}>
                        <Form.Item label={locale.title}>
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: locale.message_enter_title_for_course}],
                                initialValue: elementState.title,
                            })(
                                <Input
                                    prefix={<Icon type="highlight" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder={locale.title}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'title': e.target.value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('scholarhipsAvailable')(
                                <Checkbox
                                    checked={elementState.scholarhipsAvailable}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'scholarhipsAvailable': e.target.checked
                                    })}
                                >{locale.scholarhipsAvailable}</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Skill" hasFeedback>
                            {getFieldDecorator('minimumSkill', {
                                rules: [{required: true, message: locale.message_enter_minimum_skill}],
                                initialValue: elementState.minimumSkill,
                            })(
                                <Select placeholder={locale.message_enter_minimum_skill}
                                        onChange={value => setElementState({
                                            ...elementState,
                                            'minimumSkill': value
                                        })}>
                                    <Option value="beginner">{locale.beginner}</Option>
                                    <Option value="intermediate">{locale.intermediate}</Option>
                                    <Option value="advanced">{locale.advanced}</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.weeks}>
                            {getFieldDecorator('weeks', {
                                initialValue: elementState.weeks,
                            })(
                                <InputNumber
                                    onChange={value => setElementState({
                                        ...elementState,
                                        'weeks': value
                                    })}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={locale.description}>
                            {getFieldDecorator('description', {
                                rules: [{required: true, message: locale.message_enter_description}],
                                initialValue: elementState.description,
                            })(
                                <TextArea
                                    rows={5}
                                    placeholder={locale.message_enter_description}
                                    onChange={(e) => setElementState({
                                        ...elementState,
                                        'description': e.target.value
                                    })}
                                />,
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
                        {locale.updated} Course
                    </Button>
                </footer>
            </Form>
        </div>
    )
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(EditCourse);

export default WrappedNormalLoginForm;
