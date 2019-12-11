import React from 'react';
import {Input} from 'antd';

function DetailModeSearchByRadius(p) {
    return (
        <div className="radius">
            <Input
                name='zipCode'
                style={{width: '50%'}}
                onChange={(e) => p.onChangeInputRadiusSearchParam(e)}
                placeholder="Enter your ZipCode"
            />
            <Input
                name='distance'
                style={{width: '50%'}}
                onChange={(e) => p.onChangeInputRadiusSearchParam(e)}
                placeholder="Enter distance"
            />
        </div>
    );
}

export default DetailModeSearchByRadius;
