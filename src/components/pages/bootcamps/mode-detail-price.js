import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Input, Slider, notification} from 'antd';
import {setBootcampsFilter, clearBootcampsFilter} from "../../../redux/bootcamps/actions";

function DetailModePrice() {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.Bootcamps.filter);

    const openNotification = (mes, desc) => {
        notification.open({
            message: `${mes}`,
            description: `${desc}`,
        });
    };

    const onChangeRangeHolds = value => {
        if (value[0] === 0) {
            if (value[1] === 0) {
                dispatch(clearBootcampsFilter({name: 'priceFrom'}));
                dispatch(clearBootcampsFilter({name: 'priceTo'}));
            } else {
                dispatch(setBootcampsFilter({
                    name: 'priceFrom',
                    operator: 'gte',
                    values: 0,
                }));
                dispatch(setBootcampsFilter({
                    name: 'priceTo',
                    operator: 'lte',
                    values: value[1],
                }));
            }
        } else {
            dispatch(setBootcampsFilter({
                name: 'priceFrom',
                operator: 'gte',
                values: value[0],
            }));
            dispatch(setBootcampsFilter({
                name: 'priceTo',
                operator: 'lte',
                values: value[1],
            }));
        }
    };

    const onChangeInput = e => {
        e.persist();
        const {value, name} = e.target;

        const priceFrom = filter.find(el => el.name === 'priceFrom');
        const priceTo = filter.find(el => el.name === 'priceTo');

        if (name === 'priceFrom') {
            if (!!value && value === 0) {
                dispatch(setBootcampsFilter({
                    name,
                    operator: 'gte',
                    values: 0,
                }))
            } else if (!!value === false) {
                dispatch(clearBootcampsFilter({name: 'priceFrom'}))
            } else {
                dispatch(setBootcampsFilter({
                    name,
                    operator: 'gte',
                    values: Number(value),
                }))
            }

            const notEmptyDurationTo = priceTo
                ? priceTo.values
                : 0;
            if (priceFrom !== undefined ? value > notEmptyDurationTo : null) {
                openNotification('Notification', "The value entered can not be greater than the maximum");
            }
        }

        if (name === 'priceTo') {
            if (value) {
                if (priceFrom === undefined) {
                    dispatch(setBootcampsFilter({
                        name: 'priceFrom',
                        operator: 'gte',
                        values: 0,
                    }));
                }
                if (!!value && value === 0) {
                    dispatch(setBootcampsFilter({
                        name,
                        operator: 'lte',
                        values: 0,
                    }));
                } else if (!!value === false) {
                    dispatch(clearBootcampsFilter({name: 'priceFrom'}));
                } else {
                    dispatch(setBootcampsFilter({
                        name,
                        operator: 'lte',
                        values: value,
                    }));
                }
            } else {
                dispatch(clearBootcampsFilter({name}))
            }

            const notEmptyDurationFrom = priceFrom
                ? priceFrom.values
                : 0;
            if (priceTo !== undefined ? value < notEmptyDurationFrom : null) {
                openNotification('Notification', "The entered value can not be less than the minimum");
            }
        }
    };

    const priceFrom = filter.find(el => el.name === 'priceFrom');
    const priceTo = filter.find(el => el.name === 'priceTo');

    return (
        <div className="price">
            <p className='filter-label'>Price</p>
            <div className="price-container">
                <Input
                    name="priceFrom"
                    type="number"
                    style={{width: 90}}
                    min={0}
                    max={100000}
                    value={priceFrom ? priceFrom.values : null}
                    onChange={onChangeInput}
                />

                <Slider
                    range
                    min={0}
                    max={100000}
                    style={{width: 200, marginLeft: 10, marginRight: 10}}
                    onChange={onChangeRangeHolds}
                    value={[priceFrom ? priceFrom.values : null, priceTo ? priceTo.values : null]}
                />

                <Input
                    name="priceTo"
                    type="number"
                    style={{width: 90}}
                    min={0}
                    max={100000}
                    value={priceTo ? priceTo.values : null}
                    onChange={onChangeInput}
                />
            </div>
        </div>
    );
}

export default DetailModePrice;
