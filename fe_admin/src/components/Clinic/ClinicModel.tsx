import { Button, DatePicker, Flex, Form, Input, Modal, Select, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { getClinicById, updateClinic, createClinic } from "../../services/clinic.service";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const ClinicModel = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        const dataPost = {
          ...values,
          
          image: 'image.jpg',
        };
        //alert(JSON.stringify(dataPost))

        if (dataPost.id) {

          await updateClinic(dataPost);
          props.onUpdateSuccess();
          props.fetchData();
          setIsModalOpen(false);
          props.handleCancel();
          
        } else {
         
          await createClinic(dataPost);
          props.fetchData();
          props.onUpdateSuccess();
          setIsModalOpen(false);
          props.handleCancel();
        }
      })
      .catch(() => {
        alert("Thông tin  chưa đủ!");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    props.handleCancel();
  };

  const fetchData = async (id: any) => {
    let data = await getClinicById({
      id: id,
    });
    console.log("cli   ",data)
    form.setFieldsValue(data);
    // const date = dayjs(data?.dateOfBirth).isValid()
    //   ? dayjs(data?.dateOfBirth)
    //   : null;
    // form.setFieldValue("dateOfBirth", date);

    const genderFromAPI = data?.gender;

    const convertedGender =
      genderFromAPI === "male" ? "Nam" : genderFromAPI === "female" ? "Nữ" : "Không xác định";
    form.setFieldValue("gender", convertedGender);


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
    if (props.userid !== "") {
      fetchData(props.userid);
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
        title="Thông tin người dùng"
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
            prefix: "86",
          }}
          style={{ maxWidth: "100%" }}
          scrollToFirstError
        >
          <Form.Item
            style={{ visibility: "hidden" }}
            name="id"
            label="Mã phòng khám"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên phòng khám"
            rules={[
              {
                required: true,
                message: "Tên phòng khám không được để trống!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {
                required: true,
                message: "Địa chỉ không được để trống!",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
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

          <Form.Item
            name="introductionHtml"
            label="Giới thiệu HTML"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="introductionMarkdown"
            label="Giới thiệu Markdown"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh đại diện"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Additional form items can go here */}
        </Form>



      </Modal>
    </>
  );
};
export default ClinicModel;
