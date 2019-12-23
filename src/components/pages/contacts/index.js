import React, {Component} from 'react';
import {Avatar, Row, Col, Icon} from 'antd';
import Photo from '../../img/contact.jpg';
import {mapRender} from '../../utils/usedFunctions';

class Contacts extends Component {
    componentDidMount() {
        mapRender(document.getElementById('contactMap'), '30.654431', '50.406565');
    }

    render() {
        const {locale} = this.props;

        return (
            <div className="contact-page">
                <div className="contact-page__container">
                    <Avatar src={Photo}/>
                    <span className="about-me">
                        <i>I am a Front End Developer with 3+ years experience in developing. Throughout my career, I developed a large number of online stores, corporate websites, CRM, software for contact centers, B2B systems, SASS projects, SPA and landing pages.</i>
                        <i>I possess significant expertise in adapting various sites to mobile devices and tablets, as well as optimizing these sites functioning.</i>
                        <i> As a middle developer in my department, I train and mentor junior specialists in Front End development.</i>
                    </span>
                </div>
                <div className="find-me">
                    <h2>{locale.you_can_find_me}:</h2>
                    <Row type="flex">
                        <Col span={5}>
                            <a href="https://github.com/oleg88mo" target="_blank"><Icon type="github"/>GitHub</a>
                        </Col>
                        <Col span={5}>
                            <a href="https://www.linkedin.com/in/oleh-monastyrskyi-3947b9140/" target="_blank"><Icon type="linkedin"/>Linkedin</a>
                        </Col>
                    </Row>
                    <h3>{locale.sent_me_letter}:</h3>
                    <Row type="flex">
                        <Col span={8}>
                            <a href="mailto:oleg88mo@gmail.com"><Icon type="google"/>Gmail</a>
                        </Col>
                    </Row>
                </div>
                <div className="currently-located">
                    <h2>{locale.located_in}:</h2>
                    <div className="map" id="contactMap"/>
                </div>
            </div>
        )
    }
}

export default Contacts;
