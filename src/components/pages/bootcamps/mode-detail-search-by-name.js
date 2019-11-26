import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Input, Select} from 'antd';
import {setBootcampsFilter, clearBootcampsFilter, changeBootcampsFilterOption} from "../../../redux/bootcamps/actions";

function DetailModeSearchByName() {
    const dispatch = useDispatch();

    const filter = useSelector(state => state.Bootcamps.filter);
    const name = filter.find(el => el.name === 'name');
    const phone = filter.find(el => el.name === 'phone');
    const [valueInput, setValueInput] = useState(name ? name.values : phone ? phone.values : null);
    const [searchBy, setSearchBy] = useState(name ? name.name : phone ? phone.name : 'name');
    const {Option} = Select;

    const onChangeInput = e => {
        const {value} = e.target;

        if (value !== '') {
            dispatch(setBootcampsFilter({
                name: searchBy === 'name' ? 'name' : 'phone',
                operator: 'startWith',
                values: value,
            }));
            setValueInput(value)
        } else {
            dispatch(clearBootcampsFilter({name: searchBy === 'name' ? 'name' : 'phone'}))
        }
    };

    const onChangeSearchBy = value => {
        dispatch(changeBootcampsFilterOption({
            prev: searchBy,
            next: {
                name: value,
                operator: 'startWith',
                values: valueInput,
            }
        }));
        setSearchBy(value);
    };

    return (
        <div className="price">
            <p className='filter-label'>search by:</p>
            <div className="price-container">
                <Select
                    defaultValue={searchBy}
                    style={{width: '25%'}}
                    onChange={onChangeSearchBy}
                >
                    <Option value="name">Name</Option>
                    <Option value="phone">Phone</Option>
                </Select>
                <Input
                    name={`${searchBy === 'name' ? 'name' : 'phone'}`}
                    style={{width: '70%'}}
                    value={name ? name.values : phone && phone.values}
                    onChange={onChangeInput}
                />
            </div>
        </div>
    );
}

export default DetailModeSearchByName;
