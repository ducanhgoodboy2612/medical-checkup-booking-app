import { Flex, Modal } from "antd";
import { useEffect, useState } from "react";
import { Invoice_Delete } from "../services/invoice.services";

const InvoiceDelete = (props: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        //alert("prop id : " + props.invoice_id);
        await Invoice_Delete(props.invoice_id);
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
                title="Xóa hóa đơn"
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
                <div>Bạn có muốn xóa sản phẩm này không?</div>
            </Modal>
        </>
    );
};
export default InvoiceDelete;
