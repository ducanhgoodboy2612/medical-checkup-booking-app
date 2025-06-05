import {
  DownOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Image } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/images/OIG2.jpg";

const InfoUser = function () {

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const username = user ? user.username : 'Trump Đại hiệp';

  const LogOut = () => {
    localStorage.removeItem('user');
  }
  const items: MenuProps["items"] = [
    {
      label: <Link to={""}>Thông tin người dùng</Link>,
      key: "0",
      icon: <UserOutlined />,
    },
    {
      label: <Link to={""}>Đổi mật khẩu</Link>,
      key: "1",
      icon: <KeyOutlined />,
    },
    {
      type: "divider",
    },
    {
      label: <Link to={"/login"} onClick={()=>LogOut()}   >Đăng xuất</Link>,
      key: "1",
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <>
      <div style={{marginRight:'15px'}}>
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight:'10px'
          }}
          preview={false}
          src={logo}
        ></Image>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{fontWeight:'bold'}}>
              {username}
            </Space>
          </a>
        </Dropdown>
      </div>
    </>
  );
};
export default InfoUser;
