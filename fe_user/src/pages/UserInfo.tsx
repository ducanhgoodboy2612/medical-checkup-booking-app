import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserbyId, apiUpdateUser, changePassword } from '../services/user.services';

import { Modal, Button, Input, Select, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';


import "../assets/style/user-info.css";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  password?: string; // Password might not be returned on get
  address: string;
  phone: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  description: string | null;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  token: string | null;
}

interface UpdateUserInfoRequest {
  id: number;
  name: string;
  address: string;
  phone: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
}

interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

const UserInfo: React.FC = () => {
  // const { userId } = useParams<{ userId: string }>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for update form
  const [updateFormData, setUpdateFormData] = useState<UpdateUserInfoRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [userId, setUserId] = useState(0);
  const [userEmail, setUserEmail] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isChanging, setIsChanging] = useState(false);
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser.id);
          setUserEmail(parsedUser.email);

          const data: UserInfo = await getUserbyId(parsedUser.id);
          console.log("User data fetched:", data);
          if (data) {
            setUserInfo(data);
            setUpdateFormData({
              id: data.id,
              name: data.name,
              address: data.address,
              phone: data.phone,
              avatar: data.avatar,
              gender: data.gender,
              dateOfBirth: data.dateOfBirth,
            });
          } else {
            setError("User not found.");
          }
          setLoading(false);
        }
        
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateFormData(prevState => {
      if (prevState) {
        return {
          ...prevState,
          [name]: value,
        };
      }
      return null;
    });
  };

  // const handleUpdateSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!updateFormData) return;

  //   setIsUpdating(true);
  //   setUpdateError(null);
  //   setUpdateSuccess(false);

  //   try {
  //     await apiUpdateUser(updateFormData);
  //     setUpdateSuccess(true);
  //     setIsUpdating(false);
  //   } catch (err: any) {
  //     setUpdateError(err.message);
  //     setIsUpdating(false);
  //   }
  // };

  const handleUpdateSubmit = async () => {
    if (!updateFormData) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const payload: UpdateUserInfoRequest = {
        ...updateFormData,
        avatar: updateFormData.avatar
        // avatar: avatarFile
        //   ? await convertFileToBase64(avatarFile)
        //   : updateFormData.avatar, // giữ avatar cũ nếu không chọn file mới
      };

      await apiUpdateUser(payload);
      setUpdateSuccess(true);
      setIsModalVisible(false);
      message.success("User info updated successfully");
    } catch (err: any) {
      setUpdateError(err.message);
      message.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };
  

  // const handleChangePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setChangePasswordFormData(prevState => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleChangePasswordSubmit = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;

    if (newPassword !== confirmNewPassword) {
      message.error("New passwords do not match.");
      return;
    }

    setIsChanging(true);
    try {
      await changePassword({
        email: userEmail,
        oldPassword,
        newPassword,
      });

      message.success("Password changed successfully");
      setIsPasswordModalVisible(false);
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: any) {
      message.error(error.message || "Failed to change password");
    } finally {
      setIsChanging(false);
    }
  };
  

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo || !updateFormData) {
    return <div>User information not found.</div>;
  }

  return (
    <div className="container emp-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="profile-img">
              <img
                src={`https://localhost:44393${userInfo?.avatar}`}
                style={{borderRadius: '50%'}}
                alt=""
              />
              {/* <div className="file btn btn-lg btn-primary">
                Change Photo
                <input type="file" name="file" />
              </div> */}
            </div>
          </div>
          <div className="col-md-4">
            <div className="profile-head">
              <h5>{userInfo.name}</h5>
              {/* <h6>Web Developer and Designer</h6> Commenting out hardcoded profession */}
              {/* <p className="proile-rating">
                RANKINGS : <span>8/10</span>
              </p> */}
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Thông tin cá nhân
                  </a>
                </li>
               
              </ul>
            </div>
          </div>
          <div className="col-md-2">
            <button
              className="profile-edit-btn"
              onClick={() => setIsModalVisible(true)}
            >
              Cập nhật thông tin
            </button>
          </div>
          <div className="col-md-2">
            <button
              className="profile-edit-btn"
              onClick={() => setIsPasswordModalVisible(true)}
            >
              Đổi mật khẩu
            </button>
          </div>


        </div>
        <div className="row">
          <div className="col-md-4">
            {/* <div className="profile-work">
              <p>WORK LINK</p>
              <a href="">Website Link</a>
              <br />
              <a href="">Bootsnipp Profile</a>
              <br />
              <a href="">Bootply Profile</a>
              <p>SKILLS</p>
              <a href="">Web Designer</a>
              <br />
              <a href="">Web Developer</a>
              <br />
              <a href="">WordPress</a>
              <br />
              <a href="">WooCommerce</a>
              <br />
              <a href="">PHP, .Net</a>
              <br />
            </div> */}
          </div>
          <div className="col-md-8">
            <div className="tab-content profile-tab" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="row">
                  <div className="col-md-6">
                    <label>Id người dùng</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.id}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Họ tên</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.name}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Ngày sinh</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.dateOfBirth}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Giới tính</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.gender}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Email</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>SĐT</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.phone}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Địa chỉ</label>
                  </div>
                  <div className="col-md-6">
                    <p>{userInfo.address}</p> 
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div className="row">
                  <div className="col-md-6">
                    <label>Experience</label>
                  </div>
                  <div className="col-md-6">
                    <p>Expert</p> {/* Leaving hardcoded */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Hourly Rate</label>
                  </div>
                  <div className="col-md-6">
                    <p>10$/hr</p> {/* Leaving hardcoded */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Total Projects</label>
                  </div>
                  <div className="col-md-6">
                    <p>230</p> {/* Leaving hardcoded */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>English Level</label>
                  </div>
                  <div className="col-md-6">
                    <p>Expert</p> {/* Leaving hardcoded */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Availability</label>
                  </div>
                  <div className="col-md-6">
                    <p>6 months</p> {/* Leaving hardcoded */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label>Your Bio</label>
                    <br />
                    <p>Your detail description</p> {/* Leaving hardcoded */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Update User Info"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdateSubmit}
        okText="Save"
        confirmLoading={isUpdating}
      >
        <Input
          name="name"
          value={updateFormData?.name || ''}
          onChange={handleUpdateInputChange}
          placeholder="Name"
          style={{ marginBottom: 8 }}
        />
        <Input
          name="address"
          value={updateFormData?.address || ''}
          onChange={handleUpdateInputChange}
          placeholder="Address"
          style={{ marginBottom: 8 }}
        />
        <Input
          name="phone"
          value={updateFormData?.phone || ''}
          onChange={handleUpdateInputChange}
          placeholder="Phone"
          style={{ marginBottom: 8 }}
        />
        <Select
          value={updateFormData?.gender}
          onChange={(value) => setUpdateFormData(prev => prev ? { ...prev, gender: value } : null)}
          style={{ width: '100%', marginBottom: 8 }}
        >
          <Select.Option value="male">Nam</Select.Option>
          <Select.Option value="female">Nữ</Select.Option>
        </Select>
        <DatePicker
          style={{ width: '100%', marginBottom: 8 }}
          value={updateFormData?.dateOfBirth ? moment(updateFormData.dateOfBirth) : null}
          onChange={(date) =>
            setUpdateFormData(prev =>
              prev ? { ...prev, dateOfBirth: date?.toISOString() || '' } : null
            )
          }
        />
        <Upload
          beforeUpload={(file) => {
            setAvatarFile(file);
            return false; // prevent auto upload
          }}
          showUploadList={true}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload Avatar</Button>
        </Upload>
      </Modal>

      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={handleChangePasswordSubmit}
        okText="Update"
        confirmLoading={isChanging}
      >
        <Input.Password
          placeholder="Old Password"
          name="oldPassword"
          style={{ marginBottom: 8 }}
          value={passwordForm.oldPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
          }
        />
        <Input.Password
          placeholder="New Password"
          name="newPassword"
          style={{ marginBottom: 8 }}
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
        />
        <Input.Password
          placeholder="Confirm New Password"
          name="confirmNewPassword"
          style={{ marginBottom: 8 }}
          value={passwordForm.confirmNewPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
          }
        />
      </Modal>


    </div>

  );
};

export default UserInfo;
