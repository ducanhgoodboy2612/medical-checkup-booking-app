import { Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { apiDelete } from "../services/user.services";
const UserDelete = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await apiDelete({user_id:props.userid});
    props.fetchData();
    setIsModalOpen(false);
    props.handleCancelDelete();
    alert("Xóa người dùng thành công!");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    props.handleCancelDelete();
  };
  useEffect(() => {
    showModal();
  }, []);

  return (
    <>
      <Modal
        title="Xóa người dùng"
        open={isModalOpen}
        cancelText={"Hủy bỏ"}
        okText={"Xóa"}
        width={"40vw"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(child) => {
          return (
            <>
              <hr
                style={{
                  color: "#F8F3F3",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              />
              <Flex justify={"flex-end"} align="center" gap={8}>
                {child}
              </Flex>
            </>
          );
        }}
      >
         <div>Bạn có muốn xóa người dùng không?</div>
      </Modal>
    </>
  );
};
export default UserDelete;
