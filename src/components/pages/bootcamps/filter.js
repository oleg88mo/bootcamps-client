import React, {useState} from 'react';
import {Button} from 'antd';
import {setting} from '../../../components/img/iconSvg'
// components
import DetailMode from './mode-detail'
import SmallMode from './mode-small'

function Filter() {
    const [visible, setVisible] = useState(false);
    const [smallMode, setSmallMode] = useState(false);
    const handlerVisibleFilter = isVisible => {
        setVisible(isVisible);
        setSmallMode(false);
    };
    const handlerVisibleSmallModeFilter = isVisible => {
        setSmallMode(isVisible);
        setVisible(false)
    };

    return (
        <div className="filter">
            {!visible && <div className="action-panel">
                <Button type="primary" onClick={() => handlerVisibleFilter(true)}>{setting} Filter</Button>
            </div>}
            {visible && <DetailMode handlerVisibleSmallModeFilter={handlerVisibleSmallModeFilter}/>}
            {smallMode && <SmallMode/>}
        </div>
    );
}

export default Filter;
