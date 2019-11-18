import React from 'react';
import {Input, Button, Row, Col} from 'antd';

function DetailMode(p) {
    return (
        <div className="detail-mode">
            detail-mode
            <Button type="primary" onClick={() => p.handlerVisibleFilter(false)}>Filter Search</Button>
        </div>
    );
}

export default DetailMode;
