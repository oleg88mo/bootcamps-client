import React, {useState} from "react";
import {Layout, Menu, Icon} from 'antd';
// component
import RenderComponents from './renderComponents';

function Dashboard({locale}) {
    const {Header, Sider, Content} = Layout;
    const {SubMenu} = Menu;

    const [collapsed, setCollapsed] = useState(false);
    const [componentName, setComponentName] = useState('add-new-bootcamp');

    const toggle = () => setCollapsed(!collapsed);

    const handlerRenderComponent = (e, onSetComponentName) => {
        e && e.preventDefault();

        setComponentName(onSetComponentName)
    };

    return (
        <Layout className="dashboard">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['addNewBootcamp']}
                    defaultOpenKeys={['sub1']}
                >
                    <SubMenu
                        key="sub1"
                        title={<span>
                            <Icon type="user"/>
                            <span>Bootcamp</span>
                        </span>}
                    >
                        <Menu.Item key="addNewBootcamp">
                            <a onClick={(e) => handlerRenderComponent(e, 'add-new-bootcamp')}>{locale.add_new_bootcamp} Bootcamp</a>
                        </Menu.Item>
                        <Menu.Item key="myBootcamps">
                            <a onClick={(e) => handlerRenderComponent(e, 'my-bootcamps')}>{locale.my_bootcamps} Bootcamps</a>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={<span>
                            <Icon type="user"/>
                            <span>Courses</span>
                        </span>}
                    >
                        <Menu.Item key="addNewCourse">
                            <a onClick={(e) => handlerRenderComponent(e, 'add-new-course')}>{locale.add_new_course} Course {locale.add_new_course_for} Bootcamp</a>
                        </Menu.Item>
                        <Menu.Item key="myCourses">
                            <a onClick={(e) => handlerRenderComponent(e, 'my-courses')}>{locale.my_courses} Courses</a>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item
                        key="myInformation"
                        onClick={() => handlerRenderComponent(null, 'my-information')}
                    >
                        <Icon type="user"/>
                        <span>{locale.my_information}</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{background: '#fff', padding: 0}}>
                    <Icon
                        className="trigger"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={toggle}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        minHeight: 280,
                    }}
                >
                    <RenderComponents
                        componentName={componentName}
                        locale={locale}
                    />
                </Content>
            </Layout>
        </Layout>
    )
}

export default Dashboard;
