import { Button, DatePicker, Flex, Form, Input, Modal, Select, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { apiCreateUser, apiGetUserById, apiUpdateUser } from "../services/user.services";
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

const UserModel = (props: any) => {
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
          avatar: 'avatar.jpg',
        };
        delete dataPost.confirm;
        alert(JSON.stringify(dataPost))

        if (dataPost.id) {

          await apiUpdateUser(dataPost);
          props.onUpdateSuccess();
          props.fetchData();
          setIsModalOpen(false);
          props.handleCancel();
          
        } else {
         
          await apiCreateUser(dataPost);
          props.fetchData();
          setIsModalOpen(false);
          props.handleCancel();
          alert("Thêm người dùng thành công!");
        }
      })
      .catch(() => {
        alert("Thông tin người dùng chưa đủ!");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    props.handleCancel();
  };

  const fetchData = async (id: any) => {
    let data = await apiGetUserById({
      userId: id,
    });
    console.log(data)
    form.setFieldsValue(data);
    const date = dayjs(data?.dateOfBirth).isValid()
      ? dayjs(data?.dateOfBirth)
      : null;
    form.setFieldValue("dateOfBirth", date);
    form.setFieldValue("confirm", data.password);

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
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
       
          }}
          style={{ maxWidth: "100%" }}
          scrollToFirstError
        >
          <Form.Item
            style={{ visibility: "hidden" }}
            name="id"
            label="Mã người dùng"
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

          {/* <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[
              { required: true, message: "Ngày sinh không được để trống!" },
            ]}
          >
            <DatePicker format={{ format: "DD/MM/YYYY", type: "mask" }} />
          </Form.Item> */}

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
            name="isActive"
            label="Trạng thái"
            rules={[
              { required: true, message: "Trạng thái không được để trống!" },
            ]}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Ghi chú"
            // rules={[
            //   {
            //     required: true,
            //     message: "Mô tả không được để trống!",
            //     whitespace: true,
            //   },
            // ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>


          <h6 style={{marginLeft: 30}}>Thông tin tài khoản</h6>


          <Form.Item
            name="roleId"
            label="Quyền"
            rules={[

              {
                required: true,
                message: "Quyền tài khoản không được để trống!",
              },
            ]}
          >
            <Select>
              <Option value={1}>Admin</Option>
              <Option value={2}>Doctor</Option>
              <Option value={3}>Supporter</Option>
              <Option value={4}>User</Option>
            </Select>
          </Form.Item>
          {/* <Form.Item
            name="username"
            label="Tài khoản"
            rules={[
              {
                required: true,
                message: "Tài khoản không được để trống!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item> */}

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
export default UserModel;
