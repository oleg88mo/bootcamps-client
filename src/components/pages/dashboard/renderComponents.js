import React, {Component} from 'react';

import AddNewBootcamp from '../bootcamps/add-new-bootcamp';
import MyBootcamp from '../bootcamps/my-bootcamp';
import AddNewCourseForBootcamp from '../courses/add-new-course-for-bootcamp';
import MyInformation from './myInformation';

class RenderComponents extends Component {
    render() {
        const {componentName} = this.props;
        const component = () => {
            switch (componentName) {
                case 'add-new-bootcamp':
                    return <AddNewBootcamp/>;
                case 'my-bootcamp':
                    return <MyBootcamp/>;
                case 'add-new-course':
                    return <AddNewCourseForBootcamp/>;
                    case 'my-information':
                    return <MyInformation/>;
                default:
                    return null;
            }
        };

        return component();
    }

}

export default RenderComponents;
