import React from 'react';
import {Input} from 'antd';

function DetailModeSearchByRadius(p) {
    const {onChangeInputRadiusSearchParam, locale} = p;

    return (
        <div className="radius">
            <Input
                name='zipCode'
                style={{width: '50%'}}
                onChange={(e) => onChangeInputRadiusSearchParam(e)}
                placeholder={locale.enter_zipCode}
            />
            <Input
                name='distance'
                style={{width: '50%'}}
                onChange={(e) => onChangeInputRadiusSearchParam(e)}
                placeholder={locale.enter_distance}
            />
        </div>
    );
}

export default DetailModeSearchByRadius;
