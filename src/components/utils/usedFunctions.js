// import axios from "axios";
// import {URL} from "../../configKey";

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

// export default function responseBootcamps(pageSize, filter) {
//     let tempUrl;
//
//     // (async function () {  })();
//     const limitSearchParam = () => {
//         if (pageSize && pageSize.next) {
//             tempUrl = `page=1&limit=${pageSize.next.limit}`;
//             cycleSearchParam();
//         } else {
//             tempUrl = `page=1&limit=${pageSize.prev.limit}`;
//             cycleSearchParam();
//         }
//     };
//
//     // const getResult = () => {
//     //     console.log('tempUrl',tempUrl);
//     //     axios.get(`${URL}/bootcamps?${tempUrl}`).then(b => b)
//     //     // console.log('...myRes', myRes);
//     // };
//
//     const cycleSearchParam = async () => {
//         for (let i = 0; i < filter.length; i++) {
//             const name = filter[i].name;
//             const operator = filter[i].operator;
//             const values = filter[i].values;
//
//             if (name === 'priceFrom' || name === 'priceTo') {
//                 tempUrl = tempUrl + `&averageCost[${operator}]=${values}`;
//             } else if (name === 'ratingFrom' || name === 'ratingTo') {
//                 tempUrl = tempUrl + `&averageRating[${operator}]=${values}`;
//             } else if (name === 'careers') {
//                 tempUrl = tempUrl + `&careers[${operator}]=${values}`;
//             } else if (name === 'housing' || name === 'jobAssistance' || name === 'jobGuarantee' || name === 'acceptGi') {
//                 tempUrl = tempUrl + `&${name}=${values}`;
//             } else if (name === 'name' || name === 'phone') {
//                 tempUrl = tempUrl + `&${name}=${values}`;
//             }
//         }
//         // getResult();
//         await axios.get(`${URL}/bootcamps?${tempUrl}`).then(q => {
//             return q
//         });
//     };
//
//     limitSearchParam();
//     // cycleSearchParam();
//     // await getResult();
// };