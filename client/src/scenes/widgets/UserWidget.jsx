import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import EditProfileDialog from "components/EditProfileDialog";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;


const UserWidget = ({ userId, picturePath, setRefresh }) => {
  const [user, setUser] = useState(null);
  const [updateUser, setUpdate] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const mainUser = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const userFriends = useSelector((state) => state.user.friends);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const light = palette.neutral.light;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isFriend = userFriends.find((friend) => {
    // console.log(friend, userId);
    return friend._id !== userId;

  });

  const handleEditOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleEditSubmit = async (formData) => {
    // Logic to update user data goes here
    console.log(formData);

    const formDataToSend = new FormData();

    // Append fields to formDataToSend
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const response = await fetch(`${baseURL}/users/${userId}/updateId`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    });
    const data = await response.json();
    console.log(data)
    setUpdate(data);
  };

  const getUser = async () => {
    const response = await fetch(`${baseURL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId, updateUser, userFriends]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const patchFriend = async () => {
    if(mainUser !== userId){
      const response = await fetch(
        `${baseURL}/users/${mainUser}/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setRefresh(prev => !prev);
    };
  };

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        
        {mainUser === userId && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
          <ManageAccountsOutlined 
            sx={{ cursor: "pointer" }}
            onClick={handleEditOpen}
          />
        </Box>
      )}
        <EditProfileDialog
          open={isEditOpen}
          onClose={handleEditClose}
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          currentUser={user}
          onUpdate={handleEditSubmit}
        />
        {mainUser !== userId && (
          <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: light, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: dark }}/>
          ) : (
            <PersonAddOutlined sx={{ color: dark }}/>
          )}
        </IconButton>
        )}
        
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
