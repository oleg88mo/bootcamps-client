import React from 'react';
// components
import AddNewBootcamp from '../bootcamps/add-new-bootcamp';
import MyBootcamps from '../bootcamps/my-bootcamps';
import AddNewCourseForBootcamp from '../courses/add-new-course-for-bootcamp';
import MyCourses from '../courses/my-courses';
import MyInformation from './myInformation';

function RenderComponents({componentName, locale}) {
    const component = () => {
        switch (componentName) {
            case 'add-new-bootcamp':
                return <AddNewBootcamp locale={locale}/>;
            case 'my-bootcamps':
                return <MyBootcamps locale={locale}/>;
            case 'add-new-course':
                return <AddNewCourseForBootcamp locale={locale}/>;
            case 'my-courses':
                return <MyCourses locale={locale}/>;
            case 'my-information':
                return <MyInformation locale={locale}/>;
            default:
                return null;
        }
    };

    return component();
}

export default RenderComponents;
