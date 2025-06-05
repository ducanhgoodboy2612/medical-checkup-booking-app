import { Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { deleteClinic } from "../../services/clinic.service";
const ClinicDelete = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await deleteClinic({id : props.userid});
    props.fetchData();
    props.onUpdateSuccess();
    setIsModalOpen(false);
    props.handleCancelDelete();
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
        title="Xóa bệnh viện"
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
         <div>Bạn có muốn xóa bệnh viện này không?</div>
      </Modal>
    </>
  );
};
export default ClinicDelete;
