import React from 'react';
import {Input, Button, Row, Col} from 'antd';


function SearchForm() {
    return (
        <div className="search-form">
            <h1>Find a Code Bootcamp</h1>
            <h2>Find, rate and read reviews on coding bootcamps</h2>
            <Row>
                <Col span={12}>
                    <Input placeholder="Miles From"/>
                </Col>
                <Col span={12}>
                    <Input placeholder="Enter Zipcode"/>
                </Col>
                <Col span={24}>
                    <Button type="primary">S</Button>
                </Col>
            </Row>
        </div>
    );
}

export default SearchForm;
