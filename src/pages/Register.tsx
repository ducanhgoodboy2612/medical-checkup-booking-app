import { Button, DatePicker, Flex, Form, Input, message, Modal, Select, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { apiCreateUser} from "../services/user.services";
import { upload } from "../services/user.services";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { useNavigate } from "react-router-dom";
dayjs.extend(utc);

const { Option } = Select;

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

const Register = (props: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const navigate = useNavigate();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const uploadImg = async (): Promise<string | null> => {
        if (!avatar) {

            return null;
        }

        const formData = new FormData();
        formData.append('AvatarFile', avatar);

        try {
            const response = await upload(formData);
            console.log('User created:', response);

            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    };
   
    const handleOk = () => {
        form
            .validateFields()
            .then(async (values: any) => {
                const imageUrl = await uploadImg();

                const dateOfBirthUTC = values.dateOfBirth
                    ? dayjs(values.dateOfBirth).utc().format("YYYY-MM-DD")
                    : null;
                const dataPost = {
                    ...values,
                    avatar: imageUrl,
                    description: "none",
                    roleId: 4,
                    isActive: true,
                    dateOfBirth: dateOfBirthUTC,
                };
               
                delete dataPost.confirm;

                alert("dtpost  " + JSON.stringify(dataPost))
                await apiCreateUser(dataPost);
                props.fetchData();
                setIsModalOpen(false);
                handleCancel();
                message.success("Đăng ký thành công")
            
            })
            .catch(() => {
                message.error("Thông tin người dùng chưa đủ!");
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        navigate("/login");
    };

    useEffect(() => {
        form.resetFields();
        showModal();
    }, []);

    const validatePhoneNumber = (rule: any, value: any) => {
        if (!value) {
            return Promise.reject("Số điện thoại không được để trống!");
        } else {
            const trimmedValue = value.trim();
            if (!/^[0-9]{10}$/.test(trimmedValue)) {
                return Promise.reject("Số điện thoại phải có đúng 10 kí tự số!");
            }
        }
        return Promise.resolve();
    };

    return (
        <>
            <Modal
                title="Đăng ký tài khoản"
                open={isModalOpen}
                cancelText={"Hủy bỏ"}
                okText={"Đăng ký"}
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

                <img src="images/logo.png" alt="" style={{height: 150}} />
                <Form
                    {...formItemLayout}
                    form={form}
                    initialValues={{
                        residence: ["zhejiang", "hangzhou", "xihu"],
                        prefix: "86",

                    }}
                    style={{ maxWidth: "100%" }}
                    scrollToFirstError
                >
                    
                    <h6 style={{ marginLeft: 30 }}>Vui lòng nhập các thông tin dưới đây</h6>
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[
                            {
                                required: true,
                                message: "Họ và tên không được để trống!",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                            { required: true, message: "Giới tính không được để trống!" },
                        ]}
                    >
                        <Select placeholder="Lựa chọn giới tính">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                            <Option value="none">Không xác định</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Ngày sinh"
                        rules={[
                            { required: true, message: "Ngày sinh không được để trống!" },
                        ]}
                    >
                        <DatePicker format={{ format: "DD/MM/YYYY", type: "mask" }} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: "email",
                                message: "Sai định dạng địa chỉ email!",
                            },
                            {
                                required: true,
                                message: "Địa chỉ email không được để trống!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="SĐT"
                        rules={[

                            {
                                required: true,
                                message: "Số điện thoại không được để trống!",
                            },
                            {
                                validator: validatePhoneNumber,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item name="address" label="Địa chỉ">
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item>

                    <Form.Item

                        label="Ảnh đại diện"
                    // valuePropName="fileList"
                    // getValueFromEvent={normFile}

                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                        />
                        {/* <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button> */}
                        <img src={avatarUrl} />

                    </Form.Item>
                  

                    <h6 style={{ marginLeft: 30 }}>Mật khẩu đăng nhập</h6>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được để trống!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập lại mật khẩu!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu nhập lại không khớp!")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>



                    {/* <Form.Item label="Ảnh đại diện" name="image_url">
            <Upload {...upload_props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

        </Form.Item> */}

                </Form>
            </Modal>
        </>
    );
};
export default Register;
