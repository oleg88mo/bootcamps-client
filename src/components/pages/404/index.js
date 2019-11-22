import React from 'react';
import {Result, Button} from 'antd';
import {Link} from 'react-router-dom';

export default function PageNotFound() {
    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Link to={'/'}><Button type="primary">Back Home</Button></Link>}
            />
        </div>
    )
}
