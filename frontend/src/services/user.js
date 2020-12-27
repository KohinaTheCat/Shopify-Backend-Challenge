import http from "../http-common";

class UploadFilesService {
  upload(file) {
    let formData = new FormData();

    formData.append("files", file);
    formData.append("_id", "clara");
    formData.append("desc", "it works");

    return http.post("http://localhost:5000/files/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFilesService();
