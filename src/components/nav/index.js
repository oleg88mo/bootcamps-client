import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import axios from 'axios';
import {
    Layout, Menu, Icon,
    Dropdown,
    Button,
    notification
} from "antd";
import {URL} from '../../configKey';

// actions
import {setUser, changeLang} from '../../redux/users/actions'

const {Header} = Layout;
const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/user/auth',
        description
    });
};

class Nav extends Component {
    state = {
        isLoggin: undefined,
        email: undefined,
        name: undefined,
        role: undefined,
        isLoadingAuth: false,
        activeMenu: '1',
    };

    componentDidMount() {
        this.handlerCheckIsLoggin()
    }

    handlerCheckIsLoggin = async () => {
        const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

        if (isLoggin !== null) {
            const tokenRemoveFirstChar = isLoggin.substr(1);
            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

            this.setState({isLoadingAuth: true}, () => {
                    axios.get(`${URL}/auth/me`, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            if (response.data.success) {
                                const {email, name, role} = response.data.data;
                                this.props.setUser(response.data.data)
                                this.setState({
                                    isLoggin: true,
                                    email,
                                    name,
                                    role,
                                    isLoadingAuth: false
                                })
                            }
                        })
                        .catch(error => {
                            openNotificationWithIcon('error', error.response.data.error)
                        })
                }
            )
        }
    };

    handlerLogout = () => axios.get(`${URL}/auth/logout`)
        .then(response => {
            if (response.data.success) {
                window.localStorage.removeItem('bootcampAuthToken');
                window.location = '/';
            }
        })
        .catch(error => {
            openNotificationWithIcon('error', error.response.data.error)
        });

    handlerMenuClick = item => this.setState({activeMenu: item.key});

    handlerChangeLocale = lang => {
        this.props.changeLang(lang)
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Link to="/dashboard"><Icon type="user"/> Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button
                        onClick={this.handlerLogout}
                    >
                        <Icon type="logout"/>Logout
                    </Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[this.state.activeMenu]}
                    style={{lineHeight: '50px'}}
                    onClick={(item) => this.handlerMenuClick(item)}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/bootcamps">Bootcamps</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/contacts">Contacts</Link></Menu.Item>
                    <Menu.Item key="4" style={{float: 'right'}}>
                        <div className="lng-page">
                            <Button onClick={() => this.handlerChangeLocale('ua')}>UA</Button>
                            <Button onClick={() => this.handlerChangeLocale('en')}>EN</Button>
                            <Button onClick={() => this.handlerChangeLocale('ru')}>RU</Button>
                        </div>
                    </Menu.Item>
                    {!this.state.isLoggin && <Menu.Item
                        key="5"
                        style={{float: 'right'}}
                        className="ant-menu-item"
                    >
                        {this.state.isLoadingAuth ? <Icon type="loading"/> :
                            <Link to="/login"><Icon type="login"/>Login</Link>}
                    </Menu.Item>}
                    {!this.state.isLoggin &&
                    <Menu.Item
                        key="6"
                        style={{float: 'right'}}
                        className="ant-menu-item"
                    >
                        {this.state.isLoadingAuth ? <Icon type="loading"/> :
                            <Link to="/register"><Icon type="user"/>Register</Link>}
                    </Menu.Item>}
                    {this.state.isLoggin && <Menu.Item
                        key="7"
                        style={{float: 'right'}}
                        className="di-select"
                    >
                        <Dropdown
                            overlay={menu}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <a className="ant-dropdown-link" href="#">
                                <Icon type="user"/> {this.state.name} <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Menu.Item>}
                </Menu>
            </Header>
        )
    }
}

const mapStateToProps = state => ({
    me: state.Users.me,
});

const mapDispatchers = {
    setUser,
    changeLang,
};

export default connect(
    mapStateToProps,
    mapDispatchers,
)(Nav);
