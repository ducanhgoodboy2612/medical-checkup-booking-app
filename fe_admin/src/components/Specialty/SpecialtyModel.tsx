import { Button, Flex, Form, Input, Modal, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { createSpecialty, updateSpecialty, getSpecialtyById } from "../../services/specialty.services";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import moment from "moment";

const formItemLayout = {
    labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const SpecialtyModel = (props: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);


    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values: any) => {
                const dataPost = {
                    ...values,
                    image: imageFile ? URL.createObjectURL(imageFile) : imageUrl, // Use URL.createObjectURL for preview, handle actual upload later
                    createdAt: moment().toISOString(), // Set current date
                };

                console.log("datapost  ", dataPost)

                if (dataPost.id) {
                    await updateSpecialty(dataPost);
                    props.fetchData();
                    props.onSuccess("Cập nhật thông tin chuyên khoa thành công!");
                    setIsModalOpen(false);
                    setTimeout(() => {
                        props.handleCancel();
                    }, 200);
                } else {
                    await createSpecialty(dataPost);
                    props.fetchData();
                    props.onSuccess("Thêm chuyên khoa thành công!");
                    setIsModalOpen(false);
                    props.handleCancel();
                }
            })
            .catch(() => {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        props.handleCancel();
    };

    const fetchData = async (id: any) => {
        let data = await getSpecialtyById({
            id: id,
        });
        form.setFieldsValue(data);
        setImageUrl(data.image);
        console.log("specialty detail   ", data)
    };

    useEffect(() => {
        form.resetFields();
        setImageFile(null);
        setImageUrl(null);
        if (props.specialtyId !== "") {
            fetchData(props.specialtyId);
        }
        showModal();
    }, []);

    return (
        <>
            <Modal
                title="Thông tin chuyên khoa"
                open={isModalOpen}
                cancelText={"Hủy bỏ"}
                okText={"Lưu lại"}
                width={"60vw"}
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
                <Form
                    {...formItemLayout}
                    form={form}
                    style={{ maxWidth: "100%" }}
                    scrollToFirstError
                >
                    <Form.Item
                        style={{ visibility: "hidden" }}
                        name="id"
                        label="Mã chuyên khoa"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Tên chuyên khoa"
                        rules={[
                            {
                                required: true,
                                message: "Tên chuyên khoa không được để trống!",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            {
                                required: true,
                                message: "Mô tả không được để trống!",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input.TextArea showCount maxLength={1000} />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setImageFile(e.target.files ? e.target.files[0] : null);
                                setImageUrl(null); // Clear previous image URL when a new file is selected
                            }}
                        />
                         {imageUrl && !imageFile && (
                            <img src={`/img/spec/${imageUrl}`} alt="Specialty Image" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
                        )}
                         {imageFile && (
                            <img src={URL.createObjectURL(imageFile)} alt="Specialty Image Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
                        )}
                    </Form.Item>

                </Form>
            </Modal>
            <ToastContainer />
        </>
    );
};
export default SpecialtyModel;
