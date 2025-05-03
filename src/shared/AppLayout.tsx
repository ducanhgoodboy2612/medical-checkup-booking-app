import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
//const { Header, Content, Footer, Sider } = Layout;
const AppLayout = () => {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  };
  
  export default AppLayout;