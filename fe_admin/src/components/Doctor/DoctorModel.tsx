import { Button, DatePicker, Flex, Form, Input, Modal, Select, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { createDoctor, updateDoctor, getDoctorById, getClinicsByDocId, upload } from "../../services/doctor.services";
import { getPaged_Spec, getAllTitles } from "../../services/general.services";
import { toast, ToastContainer } from 'react-toastify';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
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

const DoctorModel = (props: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [specialties, setSpecialties] = useState([]);
    const [titles, setTitles] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [keyInfoContent, setKeyInfoContent] = useState('');
    const [infoHtmlContent, setInfoHtmlContent] = useState('');

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
                // const convertedGender =
                //     values.gender === "Nam" ? "male"
                //         : values.gender === "Nữ" ? "female"
                //             : "none";
                const dateOfBirthUTC = values.dateOfBirth
                    ? dayjs(values.dateOfBirth).utc().format("YYYY-MM-DD")
                    : null;

                const imageUrl = await uploadImg();
                const dataPost = {
                    ...values,
                    avatar: imageUrl,
                    dateOfBirth: dateOfBirthUTC,
                };

                delete dataPost.confirm;

                console.log("dtpost  ", dataPost)
                //props.onSuccess();

                if (dataPost.doctorId) {

                    await updateDoctor(dataPost);
                    props.fetchData();
                    props.onSuccess("Cập nhật thông tin bác sĩ thành công!");
                    setIsModalOpen(false);
                    //props.handleCancel();
                    setTimeout(() => {
                        props.handleCancel();
                    }, 200);
                    
                    //alert("Cập nhật người dùng thành công!");
                } else {

                    await createDoctor(dataPost);
                    props.fetchData();
                    setIsModalOpen(false);
                    props.handleCancel();
                    //alert("Thêm người dùng thành công!");
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

    const fetchSpecialties = async () => {
        try {
            const response = await getPaged_Spec({
                pageIndex: 1,
                pageSize: 50
            });
            setSpecialties(response);
            console.log("specs  ", response);
        } catch (error) {
            console.error('Error fetching specialties', error);
        }
    };

    const fetchTitles = async () => {
        try {
            const response = await getAllTitles();
            setTitles(response);
        } catch (error) {
            console.error('Error fetching specialties', error);
        }
    };

    const fetchData = async (id: any) => {
        let data = await getDoctorById({
            id: id,
        });
        form.setFieldsValue(data);
        console.log("docdetail   ", data)

        const date = dayjs(data?.dateOfBirth).isValid()
            ? dayjs(data?.dateOfBirth)
            : null;
        form.setFieldValue("dateOfBirth", date);

        const genderFromAPI = data?.gender;

        const convertedGender =
            genderFromAPI === "male" ? "Nam" : genderFromAPI === "female" ? "Nữ" : "Không xác định";
        form.setFieldsValue({
            specializationId: data.specializationId,
            titleId: data.titleId,
            gender: convertedGender,
        });
        //form.setFieldValue("gender", convertedGender);
        setKeyInfoContent(data.keyInfo);
    };

    const fetchData2 = async (id: any) => {
        let data = await getDoctorById({
            id: id,
        });
        form.setFieldsValue(data);
        let clinics = await getClinicsByDocId({
            doctorId: data.doctorId,
        });
        console.log("doc   ", data)

        const date = dayjs(data?.dateOfBirth).isValid()
            ? dayjs(data?.dateOfBirth)
            : null;
        form.setFieldValue("dateOfBirth", date);
        const genderFromAPI = data?.gender;

        const convertedGender =
            genderFromAPI === "male" ? "Nam" : genderFromAPI === "female" ? "Nữ" : "Không xác định";
        form.setFieldsValue({
            specializationId: data.specializationId,
            titleId: data.titleId,
            gender: convertedGender,
        });
        //form.setFieldValue("gender", convertedGender);
        setKeyInfoContent(data.keyInfo);

    };

    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // const upload_props: UploadProps = {
    //   name: 'file',
    //   action: 'http://localhost:52872/api/Users/upload',
    //   headers: {
    //     authorization: "Bearer " + user.token,
    //   },
    //   onChange(info) {
    //     if (info.file.status === 'done') {
    //       form.setFieldValue("image_url", info.fileList[0].response.filePath);
    //     }  
    //   },
    // };

    useEffect(() => {
        form.resetFields();
        fetchSpecialties();
        fetchTitles();
        if (props.doctorid !== "") {
            fetchData(props.doctorid);
        }
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
                title="Thông tin người dùng "
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
                    initialValues={{
                        residence: ["zhejiang", "hangzhou", "xihu"],
                        prefix: "86",

                    }}
                    style={{ maxWidth: "100%" }}
                    scrollToFirstError
                >
                    <Form.Item
                        style={{ visibility: "hidden" }}
                        name="doctorId"
                        label="Mã bác sĩ"
                    >
                        <Input />
                    </Form.Item>

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

                        label="Avatar"
                    // valuePropName="fileList"
                    // getValueFromEvent={normFile}

                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                        />
                        {/* <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button> */}

                    </Form.Item>

                    <h6 style={{ marginLeft: 30 }}>Thông tin tài khoản</h6>

                   
                    <Form.Item
                        name="specialtyId"
                        label="Specialty"
                        rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
                    >
                        <Select placeholder="Chọn chuyên ngành">
                            {specialties.map((specialty: any) => (
                                <Option key={specialty.id} value={specialty.id}>
                                    {specialty.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="titleId"
                        label="Chức danh"
                        rules={[{ required: true, message: 'Vui lòng chọn chức danh!' }]}
                    >
                        <Select placeholder="Chọn chức danh">
                            {titles.map((title: any) => (
                                <Option key={title.id} value={title.id}>
                                    {title.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="keyInfo"
                        label="Thông tin chính"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập thông tin chính!",
                            },
                        ]}
                    >
                        {/* <Input placeholder="Nhập thông tin chính..." /> */}
                        {/* <div > */}
                        {/* <Quill
                            value={keyInfoContent}
                            onChange={setKeyInfoContent}
                            placeholder="Nhập thông tin chính..."

                        /> */}

                        <Input.TextArea showCount maxLength={1000} />
                        {/* </div> */}
                    </Form.Item>

                    <Form.Item
                        name="infoHtml"
                        label="Info HTML"
                        rules={[
                            {
                                required: false,
                                message: "Vui lòng nhập thông tin HTML!",
                            },
                        ]}
                    >
                        <Quill
                            value={infoHtmlContent}
                            onChange={(value) => {
                                setInfoHtmlContent(value); 
                                form.setFieldsValue({ infoHtml: value }); 
                            }}
                            placeholder="Nhập nội dung HTML với định dạng..."
                        />
                    </Form.Item>


                    <Form.Item
                        name="bookingPrice"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá!",
                            },
                            // {
                            //   type: "number",
                            //   min: 0,
                            //   message: "Giá phải là một số dương!",
                            // },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập giá..."
                        />
                    </Form.Item>



                    

                </Form>
            </Modal>
            <ToastContainer />

        </>
    );
};
export default DoctorModel;
