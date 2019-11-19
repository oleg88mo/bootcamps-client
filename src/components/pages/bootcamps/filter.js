import React, {useState} from 'react';
import {Button} from 'antd';
import {setting} from '../../../components/img/iconSvg'
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
                <Button type="primary" onClick={() => handlerVisibleFilter(true)}>{setting} Filter</Button>
            </div>}
            {visible && <DetailMode handlerVisibleFilter={handlerVisibleFilter}/>}
            {smallMode && <SmallMode/>}
        </div>
    );
}

export default Filter;
