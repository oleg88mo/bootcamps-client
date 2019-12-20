import React from "react";
import axios from 'axios';
import {notification} from 'antd';

export const bootcampRatind = async (bootcamp, setMiddleRating) => {
    const arrayOfRatingReviews = [];

    if (bootcamp.reviews && bootcamp.reviews.length > 0) {
        await bootcamp.reviews.map(review => arrayOfRatingReviews.push(review.rating))
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let ratingSum;
    let result;

    if (arrayOfRatingReviews.length > 0) {
        ratingSum = await arrayOfRatingReviews.reduce(reducer);
        result = await ratingSum / bootcamp.reviews.length;
        await setMiddleRating(result)
    }
};

export const openNotification = (type, message, description) => {
    notification[type]({
        message,
        description
    });
};

export const sortPayload = (dataSort, fieldName) => {
    dataSort.sort((a, b) => {
        const resA = a[fieldName].toLowerCase();
        const resB = b[fieldName].toLowerCase();

        return resA > resB ? 1 : resA === resB ? 0 : -1;
    });

    return dataSort;
};

export const sortByClick = (dataSort, fieldName, payloadSortedField) => {
    dataSort.sort((a, b) => {
        let nameA = a[fieldName].toUpperCase();
        let nameB = b[fieldName].toUpperCase();

        if (nameA < nameB) {
            return payloadSortedField === 'DESC' ? -1 : 1;
        }
        if (nameA > nameB) {
            return payloadSortedField === 'DESC' ? 1 : -1;
        }

        return 0;
    });

    return dataSort;
};

export function req(options) {
    return axios({...options});
}
