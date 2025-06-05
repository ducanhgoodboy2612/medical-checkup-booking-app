import React, {  useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, theme, Image, Flex } from "antd";
import { Link, Outlet } from "react-router-dom";
// import logo from "../assets/images/utehy.jpg";
import logo from "../assets/images/Picture1.png";
import InfoUser from "./InfoUer";
import {
  HOME_PATH, USER_PATH, APPOINT_PATH, AD_DOCTOR_PATH, CLINIC_PATH, SCHEDULE_PATH,
  SPECIALTY_PATH } from "../urls";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to={HOME_PATH} style={{ color: "black" }}>Home</Link>, "1", <FileOutlined />),
  // getItem(
  //   <Link to={HOME_PATH}>Quản lý danh mục</Link>,
  //   "2",
  //   <PieChartOutlined />
  // ),
  // getItem(
  //   <Link to={HOME_PATH}>Quản lý sản phẩm</Link>,
  //   "3",
  //   <DesktopOutlined />
  // ),
  getItem(
    <Link to={HOME_PATH} style={{ color: "black" }}>Quản lý</Link>,
    "sub1",
    <UserOutlined />,
    [
      getItem(<Link to={APPOINT_PATH}>Phiếu khám</Link>, "4"),
      getItem(<Link to={AD_DOCTOR_PATH}>Bác sĩ</Link>, "5"),
      getItem(<Link to={CLINIC_PATH}>Cơ sở khám</Link>, "6"),
      getItem(<Link to={SPECIALTY_PATH}>Chuyên khoa</Link>, "7"),
      getItem(<Link to={SCHEDULE_PATH}>Lịch khám</Link>, "8"),
      getItem(
        <Link to={USER_PATH}>Người dùng</Link>,
        "9",
      ),
     
    ]
  ),
  // getItem(
  //   <Link to={HOME_PATH} style={{ color: "black" }}>Thông kê báo cáo</Link>,
  //   "sub2",
  //   <TeamOutlined />,
  //   [
  //     // getItem(<Link to={PRODUCT_REPORT}>Sản phẩm bán chạy</Link>, "7"),
  //     // getItem(<Link to={HOME_PATH}>Sản phẩm có nhiều lượt xem</Link>, "8"),
  //     // getItem(<Link to={INVENTORY_REPORT}>Sản phẩm tồn kho</Link>, "9"),
  //   ]
  // ),
  // getItem(
  //   <Link to={USER_PATH}>Quản lý người dùng</Link>,
  //   "10",
  //   <FileOutlined />
  // ),
];

interface Props {
  children?: React.ReactNode;
}

interface User {
  avatar: string;
  name: string;
}


export default function AppLayout({ children }: Props): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user, setUser] = useState<User>();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {

      setUser(user);
    } 
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        className="custom-menu"
        style={{ background: "#9AD0C2" }}

        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" style={{ textAlign: "center" }}>
          <Image
            style={{
              width: collapsed ? "40px" : "90px",
              height: collapsed ? "40px" : "90px",
              borderRadius: "50%",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            src={logo}
            preview={false}
          ></Image>
        </div>
        <Menu
          // theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ background: "#9AD0C2" }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "white" }}>
          {/* <Flex justify="space-between" align="center"> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm" />
                  </button>
                </div>
              </div>
            </form> */}

          
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 col-md-12 static-top shadow" >
              {/* Sidebar Toggle (Topbar) */}
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars" />
              </button>
              {/* Topbar Search */}
              <>
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div className="input-group">
                    {/* <input
                      type="text"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />
                    <div className="input-group-append">
                      <button className="btn" type="button">
                        <i className="fas fa-search fa-lg" />
                      </button>
                    </div> */}
                  </div>
                </form>
                {/* Topbar Navbar */}
                <ul className="navbar-nav ml-auto" >
                  {/* Nav Item - Search Dropdown (Visible Only XS) */}
                  <li className="nav-item dropdown no-arrow d-sm-none">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="searchDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-search fa-fw" />
                    </a>
                    {/* Dropdown - Messages */}
                    <div
                      className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                      aria-labelledby="searchDropdown"
                    >
                      <form className="form-inline mr-auto w-100 navbar-search">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control bg-light border-0 small"
                            placeholder="Search for..."
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                              <i className="fas fa-search fa-sm" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </li>
                  {/* Nav Item - Alerts */}
                  <li className="nav-item dropdown no-arrow mx-1">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="alertsDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-bell fa-fw" />
                      {/* Counter - Alerts */}
                      <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    {/* Dropdown - Alerts */}
                    <div
                      className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="alertsDropdown"
                    >
                      <h6 className="dropdown-header">Alerts Center</h6>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-primary">
                            <i className="fas fa-file-alt text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 12, 2019</div>
                          <span className="font-weight-bold">
                            A new monthly report is ready to download!
                          </span>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-success">
                            <i className="fas fa-donate text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 7, 2019</div>
                          $290.29 has been deposited into your account!
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-warning">
                            <i className="fas fa-exclamation-triangle text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 2, 2019</div>
                          Spending Alert: We've noticed unusually high spending for your
                          account.
                        </div>
                      </a>
                      <a className="dropdown-item text-center small text-gray-500" href="#">
                        Show All Alerts
                      </a>
                    </div>
                  </li>
                  {/* Nav Item - Messages */}
                  <li className="nav-item dropdown no-arrow mx-1">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="messagesDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-envelope fa-fw" />
                      {/* Counter - Messages */}
                      <span className="badge badge-danger badge-counter">7</span>
                    </a>
                    {/* Dropdown - Messages */}
                    <div
                      className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="messagesDropdown"
                    >
                      <h6 className="dropdown-header">Message Center</h6>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img
                            className="rounded-circle"
                            src="img/undraw_profile_1.svg"
                            alt="..."
                          />
                          <div className="status-indicator bg-success" />
                        </div>
                        <div className="font-weight-bold">
                          <div className="text-truncate">
                            Hi there! I am wondering if you can help me with a problem I've
                            been having.
                          </div>
                          <div className="small text-gray-500">Emily Fowler · 58m</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img
                            className="rounded-circle"
                            src="img/undraw_profile_2.svg"
                            alt="..."
                          />
                          <div className="status-indicator" />
                        </div>
                        <div>
                          <div className="text-truncate">
                            I have the photos that you ordered last month, how would you like
                            them sent to you?
                          </div>
                          <div className="small text-gray-500">Jae Chun · 1d</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img
                            className="rounded-circle"
                            src="img/undraw_profile_3.svg"
                            alt="..."
                          />
                          <div className="status-indicator bg-warning" />
                        </div>
                        <div>
                          <div className="text-truncate">
                            Last month's report looks great, I am very happy with the progress
                            so far, keep up the good work!
                          </div>
                          <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img
                            className="rounded-circle"
                            src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                            alt="..."
                          />
                          <div className="status-indicator bg-success" />
                        </div>
                        <div>
                          <div className="text-truncate">
                            Am I a good boy? The reason I ask is because someone told me that
                            people say this to all dogs, even if they aren't good...
                          </div>
                          <div className="small text-gray-500">Chicken the Dog · 2w</div>
                        </div>
                      </a>
                      <a className="dropdown-item text-center small text-gray-500" href="#">
                        Read More Messages
                      </a>
                    </div>
                  </li>
                  <div className="topbar-divider d-none d-sm-block" />
                  {/* Nav Item - User Information */}
                  <li className="nav-item dropdown no-arrow">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      

                      {user && (
                        <>
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            {user?.name}
                        </span>
                        <img
                          src={`https://localhost:44393${user?.avatar || ''}`}
                          alt="Doctor Avatar"
                          className="rounded-circle"
                          style={{
                            width: '45px',
                            height: '45px',
                            objectFit: 'cover',
                          }}
                        />
                        </>
                      )}

                      {/* <img
                        className="img-profile rounded-circle"
                        src="img/undraw_profile.svg"
                      /> */}
                    </a>
                    {/* Dropdown - User Information */}
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                        Profile
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                        Settings
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                        Activity Log
                      </a>
                      <div className="dropdown-divider" />
                      <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </>

            </nav>

            
            <InfoUser />
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
          {children}
        </Content>
        
      </Layout>
    </Layout>
  );
};
