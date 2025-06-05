import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PATH } from "../urls";

export function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Không tìm thấy trang";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="404"
      title={"Không tìm thấy trang"}
      subTitle={"Xin lỗi, trang bạn đang tìm kiếm không tồn tại."}
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
