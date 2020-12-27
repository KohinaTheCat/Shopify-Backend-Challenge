import React from "react";
import "./profile.css";
import { Upload, Message } from "element-react";
import Nav from "../../components/Nav/Nav";
import UploadService from "../../services/user";

const Profile = () => {
  const handleAvatarScucess = (res, file) => {
    console.log(URL.createObjectURL(file.raw));
  };

  const beforeAvatarUpload = (file) => {
    console.log(file);
    const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      Message("the file type is not a JPG");
    }
    if (!isLt2M) {
      Message("the file type is greater tahn 2MB");
    }

    UploadService.upload(file).then(() => {
      return isJPG && isLt2M;
    });
  };

  return (
    <div class="profile background">
      <Nav></Nav>
      <div class="row">
        <div class="text-area">
          <p>this is some tesxt</p>
        </div>
        <img
          class="rand-img"
          alt="img"
          src="http://localhost:5000/files/get/5fe7e0c7b90e333f28211da4"
        />
        <Upload
          className="avatar-uploader"
          action=""
          showFileList={false}
          onSuccess={(res, file) => handleAvatarScucess(res, file)}
          beforeUpload={(file) => beforeAvatarUpload(file)}
        >
          <i className="el-icon-plus avatar-uploader-icon"></i>
        </Upload>
      </div>
      {/* <el-button type="danger" round>reminisce some more</el-button> */}
    </div>
  );
};

export default Profile;
