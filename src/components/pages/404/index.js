import React from 'react';
import {Result, Button} from 'antd';
import {Link} from 'react-router-dom';

export default function PageNotFound({locale}) {
    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle={locale.not_authorized}
                extra={<Link to={'/'}><Button type="primary">{locale.back_home}</Button></Link>}
            />
        </div>
    )
}
