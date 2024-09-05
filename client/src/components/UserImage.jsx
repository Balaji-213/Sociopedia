import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  // Check if the image is a base64 encoded string
  const isBase64 = image && image.startsWith('data:');
  // Check if the image is an external URL
  const isExternalUrl = image && (image.startsWith('http') || image.startsWith('https'));
  // Determine the image URL to use
  const imageUrl = isBase64 ? image : isExternalUrl ? image : `http://localhost:3001/assets/${image}`;

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"  
        src={imageUrl}
      />
    </Box>
  );
};

export default UserImage;
