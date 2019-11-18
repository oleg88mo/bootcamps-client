import React, {useState} from 'react';
import {Input, Button, Row, Col} from 'antd';

// components
import DetailMode from './mode-detail'
import SmallMode from './mode-small'

function Filter() {
    const [visible, setVisible] = useState(false);
    const [smallMode, setSmallMode] = useState(false);
    const handlerVisibleFilter = (isVisible) => {
        setVisible(isVisible)
    };

    return (
        <div className="filter">
            {!visible && <div className="action-panel">
                <Button type="primary" onClick={() => handlerVisibleFilter(true)}>Filter</Button>
            </div>}
            {visible && <DetailMode handlerVisibleFilter={handlerVisibleFilter}/>}
            {smallMode && <SmallMode/>}
        </div>
    );
}

export default Filter;
