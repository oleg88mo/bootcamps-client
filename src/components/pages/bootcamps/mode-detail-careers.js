import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Select} from 'antd';
// actions
import {setBootcampsFilter, clearBootcampsFilter} from "../../../redux/bootcamps/actions";

function DetailModeCareers({locale}) {
    const dispatch = useDispatch();

    const filter = useSelector(state => state.Bootcamps.filter);
    const careers = filter.find(el => el.name === 'careers');

    const {Option} = Select;

    const onChangeCareers = value => {
        if (value) {
            dispatch(setBootcampsFilter({
                name: 'careers',
                operator: 'in',
                values: value,
            }))
        } else {
            dispatch(clearBootcampsFilter({name: 'careers'}));
        }
    };

    return (
        <div className="careers">
            <p className='filter-label'>{locale.search_by_careers}:</p>
            <div className="careers-container">
                <Select
                    allowClear
                    defaultValue={careers && careers.values}
                    style={{width: '100%'}}
                    onChange={onChangeCareers}
                >
                    <Option value="Web Development">Web Development</Option>
                    <Option value="Mobile Development">Mobile Development</Option>
                    <Option value="UI/UX">UI/UX</Option>
                    <Option value="Data Science">Data Science</Option>
                    <Option value="Business">Business</Option>
                    <Option value="Other">{locale.other}</Option>
                </Select>
            </div>
        </div>
    );
}

export default DetailModeCareers;
