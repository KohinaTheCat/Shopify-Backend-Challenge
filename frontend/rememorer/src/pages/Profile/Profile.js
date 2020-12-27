import React from "react";
import "./profile.css";
import { Upload } from "element-react";
import Nav from "../../components/Nav/Nav";

const Profile = () => {
  const handleRemove = (file, fileList) => {
    console.log(file, fileList);
  };

  const handlePictureCardPreview = (file) => {
    this.setState({
      dialogImageUrl: file.url,
      dialogVisible: true,
    });
  };

  return (
    <div class="profile background">
      <Nav></Nav>
      <div class="row">
        <div class="text-area">
          <p>this is some tesxt</p>
        </div>
        <img alt="img" src="http://localhost:5000/files/get/5fe7e0c7b90e333f28211da4" />
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          onPreview={(file) => this.handlePictureCardPreview(file)}
          onRemove={(file, fileList) => this.handleRemove(file, fileList)}
        >
          <i className="el-icon-plus"></i>
        </Upload>
      </div>
      {/* <el-button type="danger" round>reminisce some more</el-button> */}
    </div>
  );
};

export default Profile;
