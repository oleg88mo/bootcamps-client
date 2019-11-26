import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Checkbox} from 'antd';
import {setBootcampsFilter, clearBootcampsFilter} from "../../../redux/bootcamps/actions";

function DetailModeWithCheckbox() {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.Bootcamps.filter);

    const onChangeChecked = (name, value) => {
        if (value) {
            dispatch(setBootcampsFilter({
                name,
                operator: 'contain',
                values: value,
            }))
        } else {
            dispatch(clearBootcampsFilter({name}));
        }
    };

    return (
        <div className="checkbox">
            <div className="checkbox-container">
                <Checkbox defaultChecked={filter && filter.find(elem => elem.name === 'housing')} onChange={(e) => onChangeChecked('housing', e.target.checked)}>Housing</Checkbox>
                <Checkbox defaultChecked={filter && filter.find(elem => elem.name === 'jobAssistance')} onChange={(e) => onChangeChecked('jobAssistance', e.target.checked)}>Job Assistance</Checkbox>
                <Checkbox defaultChecked={filter && filter.find(elem => elem.name === 'jobGuarantee')} onChange={(e) => onChangeChecked('jobGuarantee', e.target.checked)}>Job Guarantee</Checkbox>
                <Checkbox defaultChecked={filter && filter.find(elem => elem.name === 'acceptGi')} onChange={(e) => onChangeChecked('acceptGi', e.target.checked)}>Accepts GI Bill</Checkbox>
            </div>
        </div>
    );
}

export default DetailModeWithCheckbox;
