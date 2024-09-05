import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, useTheme     } from "@mui/material";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const EditProfileDialog = ({ open, onClose, onUpdate, currentUser, userId }) => {
      const { palette } = useTheme();
      
      const [formData, setFormData] = useState({
        id: "",
        profilePicture: "",
        firstName: "",
        lastName: "",
        location: "",
        occupation: "",
        pictureName: "",
      });
    
      const [initialData, setInitialData] = useState({});
    
      useEffect(() => {
        if (currentUser) {
          const initial = {
            id: userId,
            profilePicture: currentUser.picturePath || "",
            firstName: currentUser.firstName || "",
            lastName: currentUser.lastName || "",
            location: currentUser.location || "",
            occupation: currentUser.occupation || "",
            // Add other fields as needed
          };
          setFormData(initial);
          setInitialData(initial);
        }
      }, [currentUser, userId]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const base64String = await convertFileToBase64(file);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: base64String,
          pictureName: file,
        }));
      };
    
      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {};
    
        // Compare formData with initialData
        for (let key in formData) {
          if (formData[key] !== initialData[key]) {
            updatedData[key] = formData[key];
          }
        }
    
        onUpdate(updatedData);
        onClose();
      };

  return (
    <Dialog open={open} onClose={onClose} sx={{ padding: "5rem" }} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent sx={{
          padding: "2rem",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
      <Box sx={{ padding: "1rem 0" }}>
                    <FlexBetween alignItems="center" gap="1rem">
                        <Box>
                            <UserImage image={formData.profilePicture} size="80px" />
                        </Box>
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            onDrop={handleDrop}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    sx={{ "&:hover": { cursor: "pointer" }, width: "100%" }}
                                >
                                    <input {...getInputProps()} />
                                    <FlexBetween>
                                        <Typography>Add Picture Here</Typography>
                                        <EditOutlinedIcon />
                                    </FlexBetween>
                                </Box>
                            )}
                        </Dropzone>
                    </FlexBetween>
                </Box>
        <TextField
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="occupation"
          label="Occupation"
          value={formData.occupation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
