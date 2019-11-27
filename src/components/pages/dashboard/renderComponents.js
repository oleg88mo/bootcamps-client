import React, {Component} from 'react';

import AddNewBootcamp from '../bootcamps/add-new-bootcamp';

class RenderComponents extends Component {
    render() {
        const {componentName} = this.props;
        const component = () => {
            switch (componentName) {
                case 'add-new-bootcamp':
                    return <AddNewBootcamp/>;
                default:
                    return null;
            }
        };

        return component();
    }

}

export default RenderComponents;
