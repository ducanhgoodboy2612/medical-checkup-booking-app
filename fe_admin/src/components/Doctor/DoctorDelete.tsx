import { Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { deleteDoctor } from "../../services/doctor.services";
const DoctorDelete = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await deleteDoctor(props.doctorid);
    props.fetchData();
    setIsModalOpen(false);
    props.handleCancelDelete();
    alert("Xóa thành công!");
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
        title="Xóa thông tin bác sĩ"
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
         <div>Bạn có muốn chắc chắn muốn xóa?</div>
      </Modal>
    </>
  );
};
export default DoctorDelete;
