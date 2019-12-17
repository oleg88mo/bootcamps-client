import React from "react";
import {Tag, Tooltip} from "antd";

export default function CareersComponent(p) {
    const {locale, careers} = p;

    return(
        <>
                <Tag
                    closable
                    onClose={() => p.closeTag(careers.name)}
                    key={careers.name}
                    className="__filter"
                >
                    <Tooltip placement="top" title={locale.filter_career}>{careers.values}</Tooltip>
                </Tag>
        </>
    )
}
