import React from 'react';
import {useSelector} from "react-redux";
// components
import FromTo from './filter-from-to';
import CareersComponent from './careers';
import AdditionalComponent from './additionalFilter';
import NamePhoneComponent from './name_phone__filter';
import RadiusComponent from './radius__filter';

function SmallMode(p) {
    const {locale, closeTag} = p;
    const {filter} = useSelector(state => state.Bootcamps);
    // price
    const priceFrom = filter && filter.find(m => m.name === 'priceFrom');
    const priceTo = filter && filter.find(m => m.name === 'priceTo');
    // rating
    const ratingFrom = filter && filter.find(m => m.name === 'ratingFrom');
    const ratingTo = filter && filter.find(m => m.name === 'ratingTo');
    // careers
    const careers = filter && filter.find(m => m.name === 'careers');
    // housing || jobAssistance || jobGuarantee || acceptGi
    const housing = filter && filter.find(m => m.name === 'housing');
    const jobAssistance = filter && filter.find(m => m.name === 'jobAssistance');
    const jobGuarantee = filter && filter.find(m => m.name === 'jobGuarantee');
    const acceptGi = filter && filter.find(m => m.name === 'acceptGi');
    // name || phone
    const name = filter && filter.find(m => m.name === 'name');
    const phone = filter && filter.find(m => m.name === 'phone');
    // search by radius
    const zipCode = filter && filter.find(m => m.name === 'zipCode');
    const distance = filter && filter.find(m => m.name === 'distance');

    return (
        <div className="small-mode">
            <span className="title">You select:</span>
            {/* price */}
            {priceFrom || priceTo ? (<FromTo from={priceFrom} to={priceTo} localeFrom={locale.price_from} localeTo={locale.price_to} closeTag={closeTag}/>) : null}
            {/* rating */}
            {ratingFrom || ratingTo ? (<FromTo from={ratingFrom} to={ratingTo} localeFrom={locale.rating_from} localeTo={locale.rating_to} closeTag={closeTag}/>) : null}
            {/* careers */}
            {careers && (<CareersComponent careers={careers} locale={locale} closeTag={closeTag}/>)}
            {/* housing || jobAssistance || jobGuarantee || acceptGi */}
            {housing && (<AdditionalComponent el={housing} locale={locale.housing} closeTag={closeTag}/>)}
            {jobAssistance && (<AdditionalComponent el={jobAssistance} locale={locale.job_assistance} closeTag={closeTag}/>)}
            {jobGuarantee && (<AdditionalComponent el={jobGuarantee} locale={locale.job_guarantee} closeTag={closeTag}/>)}
            {acceptGi && (<AdditionalComponent el={acceptGi} locale={locale.accepts_gi_bill} closeTag={closeTag}/>)}
            {/* name || phone */}
            {name || phone ? (<NamePhoneComponent el={name || phone} locale={locale} closeTag={closeTag}/>) : null}
            {/* search by radius */}
            {zipCode && distance ? (<RadiusComponent zipCode={zipCode} distance={distance} locale={locale} closeTag={closeTag}/>) : null}
        </div>
    );
}

export default SmallMode;
