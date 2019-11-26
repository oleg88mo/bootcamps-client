import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Input, Slider, notification} from 'antd';
import {setBootcampsFilter, clearBootcampsFilter} from "../../../redux/bootcamps/actions";

function DetailModeRating() {
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
                dispatch(clearBootcampsFilter({name: 'ratingFrom'}));
                dispatch(clearBootcampsFilter({name: 'ratingTo'}));
            } else {
                dispatch(setBootcampsFilter({
                    name: 'ratingFrom',
                    operator: 'gte',
                    values: 0,
                }));
                dispatch(setBootcampsFilter({
                    name: 'ratingTo',
                    operator: 'lte',
                    values: value[1],
                }));
            }
        } else {
            dispatch(setBootcampsFilter({
                name: 'ratingFrom',
                operator: 'gte',
                values: value[0],
            }));
            dispatch(setBootcampsFilter({
                name: 'ratingTo',
                operator: 'lte',
                values: value[1],
            }));
        }
    };

    const onChangeInput = e => {
        e.persist();
        const {value, name} = e.target;

        const ratingFrom = filter.find(el => el.name === 'ratingFrom');
        const ratingTo = filter.find(el => el.name === 'ratingTo');

        if (name === 'ratingFrom') {
            if (!!value && value === 0) {
                dispatch(setBootcampsFilter({
                    name,
                    operator: 'gte',
                    values: 0,
                }))
            } else if (!!value === false) {
                dispatch(clearBootcampsFilter({name: 'ratingFrom'}))
            } else {
                dispatch(setBootcampsFilter({
                    name,
                    operator: 'gte',
                    values: Number(value),
                }))
            }

            const notEmptyDurationTo = ratingTo
                ? ratingTo.values
                : 0;
            if (ratingFrom !== undefined ? value > notEmptyDurationTo : null) {
                openNotification('Notification', "The value entered can not be greater than the maximum");
            }
        }

        if (name === 'ratingTo') {
            if (value) {
                if (ratingFrom === undefined) {
                    dispatch(setBootcampsFilter({
                        name: 'ratingFrom',
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
                    dispatch(clearBootcampsFilter({name: 'ratingFrom'}));
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

            const notEmptyDurationFrom = ratingFrom
                ? ratingFrom.values
                : 0;
            if (ratingTo !== undefined ? value < notEmptyDurationFrom : null) {
                openNotification('Notification', "The entered value can not be less than the minimum");
            }
        }
    };

    const ratingFrom = filter.find(el => el.name === 'ratingFrom');
    const ratingTo = filter.find(el => el.name === 'ratingTo');

    return (
        <div className="rating">
            <p className='filter-label'>by Rating:</p>
            <div className="rating-container">
                <Input
                    name="ratingFrom"
                    type="number"
                    style={{width: 90}}
                    min={0}
                    max={10}
                    value={ratingFrom ? ratingFrom.values : null}
                    onChange={onChangeInput}
                />

                <Slider
                    range
                    min={0}
                    max={10}
                    style={{width: 200, marginLeft: 10, marginRight: 10}}
                    onChange={onChangeRangeHolds}
                    value={[ratingFrom ? ratingFrom.values : null, ratingTo ? ratingTo.values : null]}
                />

                <Input
                    name="ratingTo"
                    type="number"
                    style={{width: 90}}
                    min={0}
                    max={10}
                    value={ratingTo ? ratingTo.values : null}
                    onChange={onChangeInput}
                />
            </div>
        </div>
    );
}

export default DetailModeRating;
