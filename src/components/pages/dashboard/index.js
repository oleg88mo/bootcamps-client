import React, {Component} from "react";
import {Layout, Menu, Icon} from 'antd';
import RenderComponents from './renderComponents';

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;

class Dashboard extends Component {
    state = {
        collapsed: false,
        componentName: 'add-new-bootcamp'
    };

    toggle = () => this.setState({collapsed: !this.state.collapsed});

    handlerRenderComponent = (e, componentName) => {
        e && e.preventDefault();

        this.setState({componentName})
    };

    render() {
        return (
            <Layout className="dashboard">
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['222']}
                        defaultOpenKeys={['sub1']}
                    >
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user"/><span>Bootcamp</span></span>}
                        >
                            <Menu.Item key="222">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'add-new-bootcamp')}>Add New
                                    Bootcamp</a>
                            </Menu.Item>
                            <Menu.Item key="222-222">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'my-bootcamp')}>My Bootcamp</a>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><Icon type="user"/><span>Courses</span></span>}
                        >
                            <Menu.Item key="sub2-1">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'add-new-course')}>Add New Course For
                                    Bootcamp</a>
                            </Menu.Item>
                            <Menu.Item key="sub2-2">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'my-bootcamp')}>My Courses</a>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="3" onClick={() => this.handlerRenderComponent(null, 'my-information')}>
                            <Icon type="user"/>
                            <span>Me</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
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
                        <RenderComponents componentName={this.state.componentName}/>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Dashboard;
