import React from 'react';
import {Col, Icon, Result} from 'antd';

function EmptyList(p) {
    const {locale, data} = p;

    return (
        <>
            {data === null ? [1, 2, 3, 4, 5].map(i => (<Col
                    key={i}
                    span={6}
                    className="bootcamp-item"
                >
                    <div>
                        <Icon type="loading" className="loading"/>
                        <div className="img"/>
                        <span className="title">...</span>
                    </div>
                </Col>)
            ) : (<Result
                status="403"
                subTitle={locale.data_empty}
            />)
            }
        </>
    );
}

export default EmptyList;
