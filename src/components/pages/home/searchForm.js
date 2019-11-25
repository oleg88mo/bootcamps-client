import React from 'react';
import {Input, Button, Row, Col} from 'antd';

function SearchForm({locale}) {
    return (
        <div className="search-form">
            <h1>{locale.main_page.title}</h1>
            <h2>{locale.main_page.description}</h2>
            <Row>
                <Col span={12}>
                    <Input placeholder="Miles From"/>
                </Col>
                <Col span={12}>
                    <Input placeholder="Enter Zipcode"/>
                </Col>
                <Col span={24}>
                    <Button type="primary">{locale.search}</Button>
                </Col>
            </Row>
        </div>
    );
}

export default SearchForm;
