import React from 'react';

import {Row, Col, Icon} from 'antd';

function EmptyList() {
    return (
        <>
            {[1, 2, 3, 4, 5]
                .map(i => (
                    <Col
                        key={i}
                        span={6}
                        className="bootcamp-item"
                    >
                        <div className='movie'>
                            <Icon type="loading" className="loading"/>
                            <div className="img"/>
                            <span className="title">...</span>
                        </div>
                    </Col>
                ))
            }
        </>
    );
}

export default EmptyList;
