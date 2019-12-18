import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {Layout, Menu, Icon, Dropdown, Button} from "antd";
import {openNotification} from '../utils/usedFunctions';
import {URL} from '../../configKey';
// actions
import {setUser, changeLang, changePageName} from '../../redux/users/actions'

function Nav(p) {
    const bootcampPageStorage = window.localStorage.getItem('bootcampPage');
    const bootcampPageRedux = useSelector(state => state.Users.bootcampPage);
    const bootcampPage = bootcampPageStorage ? bootcampPageStorage : bootcampPageRedux;

    const dispatch = useDispatch();
    const {Header} = Layout;

    const locale = p.locale;

    const {lang} = useSelector(state => state.Users);
    const [isLoggin, setIsLoggin] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);
    const [name, setName] = useState(null);

    const handlerCheckIsLoggin = async () => {
        const isLoggin = await window.localStorage.getItem('bootcampAuthToken');

        if (isLoggin !== null) {
            const tokenRemoveFirstChar = isLoggin.substr(1);
            const token = tokenRemoveFirstChar.substring(0, isLoggin.length - 2);

            setIsLoadingAuth(true);

            axios.get(`${URL}/auth/me`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.success) {
                        const {name} = response.data.data;

                        dispatch(setUser(response.data.data));
                        setIsLoadingAuth(false);
                        setName(name);
                        setIsLoggin(true);
                    }
                })
                .catch(error => {
                    if (error) {
                        openNotification('error', '/auth/me', error.response && error.response.data.error)
                    }
                })
        }
    };

    const handlerLogout = () => axios.get(`${URL}/auth/logout`).then(response => {
        if (response.data.success) {
            window.localStorage.removeItem('bootcampAuthToken');
            window.location = '/';
        }
    }).catch(error => {
        openNotification('error', '/auth/logout', error.response && error.response.data.error)
    });

    const handlerMenuClick = item => {
        window.localStorage.setItem('bootcampPage', item.key);
        dispatch(changePageName(item.key));
    };

    const handlerChangeLocale = lang => dispatch(changeLang(lang));

    const menu = (<Menu>
        <Menu.Item key="0">
            <Link to="/dashboard"><Icon type="user"/> {locale.dashboard}</Link>
        </Menu.Item>
        <Menu.Item key="1">
            <Button onClick={handlerLogout}><Icon type="logout"/>{locale.logout}</Button>
        </Menu.Item>
    </Menu>);

    useEffect(() => {
        let mounted = true;

        const checkIsLoggin = () => {
            if (mounted) {
                handlerCheckIsLoggin()
            }
        };

        checkIsLoggin();

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
            <div className="logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[bootcampPage]}
                style={{lineHeight: '50px'}}
                onClick={(item) => handlerMenuClick(item)}
            >
                <Menu.Item key="1"><Link to="/">{locale.home_page}</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/bootcamps">Bootcamps</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/contacts">{locale.contacts_page}</Link></Menu.Item>
                <Menu.Item key="4" style={{float: 'right'}} className="header-locale">
                    <div className="lng-page">
                        <Button onClick={() => handlerChangeLocale('ua')} className={`${lang === 'ua' ? 'active' : ''}`}>UA</Button>
                        <Button onClick={() => handlerChangeLocale('en')} className={`${lang === 'en' ? 'active' : ''}`}>EN</Button>
                        <Button onClick={() => handlerChangeLocale('ru')} className={`${lang === 'ru' ? 'active' : ''}`}>RU</Button>
                    </div>
                </Menu.Item>
                {!isLoggin && <Menu.Item
                    key="5"
                    style={{float: 'right'}}
                    className="ant-menu-item"
                >
                    {isLoadingAuth ? <Icon type="loading"/> : <Link to="/login"><Icon type="login"/>{locale.login}</Link>}
                </Menu.Item>}
                {!isLoggin &&
                <Menu.Item
                    key="6"
                    style={{float: 'right'}}
                    className="ant-menu-item"
                >
                    {isLoadingAuth ? <Icon type="loading"/> : <Link to="/register"><Icon type="user"/>{locale.register}</Link>}
                </Menu.Item>}
                {isLoggin && <Menu.Item
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
                            <Icon type="user"/> {name} <Icon type="down"/>
                        </a>
                    </Dropdown>
                </Menu.Item>}
            </Menu>
        </Header>
    )
}

export default Nav;
