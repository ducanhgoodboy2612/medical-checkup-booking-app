import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PATH } from "../urls";

export function NotAuthorizationPage(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Không có quyền truy cập";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="403"
      title={"Không có quyền truy cập"}
      subTitle={"Xin lỗi, bạn không có quyền truy cập trang này."}
      extra={
        <Button type="primary" onClick={backHome}>
          {"Quay lại trang chủ"}
        </Button>
      }
    />
  );

  function backHome() {
    navigate(HOME_PATH);
  }
}
