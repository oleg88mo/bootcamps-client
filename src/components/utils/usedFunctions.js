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