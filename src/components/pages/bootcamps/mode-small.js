import React from 'react';
import {useSelector} from "react-redux";
// components
import PriceComponent from './from-to__price';
import RatingComponent from './from-to__rating';
import CareersComponent from './careers';
import AdditionalComponent from './additionalFilter';
import NamePhoneComponent from './name_phone__filter';
import RadiusComponent from './radius__filter';

function SmallMode(p) {
    const {locale} = p;
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
            {priceFrom || priceTo ? <PriceComponent from={priceFrom} to={priceTo} locale={locale} closeTag={p.closeTag}/> : null}
            {/* rating */}
            {ratingFrom || ratingTo ? <RatingComponent from={ratingFrom} to={ratingTo} locale={locale} closeTag={p.closeTag}/> : null}
            {/* careers */}
            {careers && <CareersComponent careers={careers} locale={locale} closeTag={p.closeTag}/>}
            {/* housing || jobAssistance || jobGuarantee || acceptGi */}
            {housing && <AdditionalComponent el={housing} locale={locale.housing} closeTag={p.closeTag}/>}
            {jobAssistance && <AdditionalComponent el={jobAssistance} locale={locale.job_assistance} closeTag={p.closeTag}/>}
            {jobGuarantee && <AdditionalComponent el={jobGuarantee} locale={locale.job_guarantee} closeTag={p.closeTag}/>}
            {acceptGi && <AdditionalComponent el={acceptGi} locale={locale.accepts_gi_bill} closeTag={p.closeTag}/>}
            {/* name || phone */}
            {name || phone ? <NamePhoneComponent el={name || phone} locale={locale} closeTag={p.closeTag}/> : null}
            {/* search by radius */}
            {zipCode && distance ? <RadiusComponent zipCode={zipCode} distance={distance} locale={locale} closeTag={p.closeTag}/> : null}
        </div>
    );
}

export default SmallMode;
