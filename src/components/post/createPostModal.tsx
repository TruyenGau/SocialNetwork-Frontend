"use client";

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreatePostModal({ open, onClose }: any) {
  const { data: session } = useSession();
  const [namePost, setNamePost] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Chọn nhiều ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files as FileList | null;
    if (!filesList) return; // tránh null

    setFiles((prev) => [...prev, ...Array.from(filesList)]);
  };

  // Xóa ảnh preview
  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // UPLOAD + TẠO POST
  const handleSubmit = async () => {
    if (!session) return alert("Bạn cần đăng nhập!");
    if (!namePost.trim()) return alert("Vui lòng nhập tiêu đề!");

    setIsLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("media", file));

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload-media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            folder_type: "post", //
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedImages = uploadRes?.data?.data?.images || [];
      const uploadedVideos = uploadRes?.data?.data?.videos || [];

      if (uploadedImages.length === 0) {
        alert("Upload ảnh thất bại!");
        setIsLoading(false);
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts`,
        {
          namePost,
          content,
          userId: session?.user?._id,
          images: uploadedImages, // danh sách filename trả về từ upload
          videos: uploadedVideos,
          community: "test",
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      alert("Tạo bài viết thành công!");
      setNamePost("");
      setContent("");
      setFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi tạo bài viết!");
    }
    router.refresh();
    setIsLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          width: 450,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" textAlign="center" fontWeight="bold">
          Tạo bài viết mới
        </Typography>

        <TextField
          label="Tiêu đề"
          fullWidth
          value={namePost}
          onChange={(e) => setNamePost(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          label="Nội dung"
          fullWidth
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Nút chọn file */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<ImageIcon />}
          sx={{ mt: 2 }}
        >
          Chọn ảnh / video
          <input
            hidden
            multiple
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </Button>

        {/* XEM TRƯỚC ẢNH + XÓA */}
        {files.length > 0 && (
          <Box sx={{ mt: 2, maxHeight: 300, overflowY: "auto" }}>
            {files.map((file, i) => (
              <Box key={i} sx={{ position: "relative", mt: 1 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{ width: "100%", borderRadius: 8 }}
                />
                <IconButton
                  onClick={() => removeImage(i)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "white",
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Nút đăng */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Đang đăng bài..." : "Đăng bài viết"}
        </Button>
      </Box>
    </Modal>
  );
}
