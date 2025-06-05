import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PATH } from "../urls";
export function ServerErrorPage(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lỗi hệ thống";
  }, []);

  return (
    <Result
      style={{ paddingTop: 150 }}
      status="500"
      title={"Lỗi máy chủ"}
      subTitle={"Xin lỗi, máy chủ đang gặp sự cố. Vui lòng thử lại sau."}
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
