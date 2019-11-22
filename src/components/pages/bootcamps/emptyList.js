import React from 'react';
import {Col, Icon, Result} from 'antd';

function EmptyList(p) {
    console.log('p', p)
    return (
        <>
            {p.data === null ? [1, 2, 3, 4, 5].map(i => (
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
            )) : <Result
                status="403"
                subTitle="Dara length === 0"
            />
            }
        </>
    );
}

export default EmptyList;
