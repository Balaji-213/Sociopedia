import User from "../models/User.js";
import Post from "../models/Post.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersByName = async (req, res) => {
  try {
    const { name } = req.params;
    const [firstName, lastName] = name.split(' ');

    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    let query = {};
    if (firstName) {
      const regexFirstName = new RegExp(firstName, 'i');
      query.firstName = regexFirstName;
    }
    if (lastName) {
      const regexLastName = new RegExp(lastName, 'i');
      query.lastName = regexLastName;
    }

    const users = await User.find(query);

    const simplifiedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }));

    res.status(200).json(simplifiedUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    if(id == friendId){
      res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }
    else{
      const user = await User.findById(id);
      const friend = await User.findById(friendId);

      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();

      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );

      res.status(200).json(formattedFriends);
    };
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      profilePicture, // Fixed typo
      location,
      occupation,
    } = req.body;

    console.log(req.body);

    let updatedData = {};

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Conditionally add fields to updatedData
    let updatePosts = false;

    if (firstName && firstName !== currentUser.firstName) {
      updatedData.firstName = firstName;
      updatePosts = true;
    }
    if (lastName && lastName !== currentUser.lastName) {
      updatedData.lastName = lastName;
      updatePosts = true;
    }
    if (location) updatedData.location = location;
    if (occupation) updatedData.occupation = occupation;

    // Handle profile picture upload
    if (profilePicture) {
      const imageUrl = await uploadImage(profilePicture);
      updatedData.picturePath = imageUrl;
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let postUpdateMessage = 'No posts updated';
    if (updatePosts) {
      const updatedPostData = {
        firstName: firstName || currentUser.firstName,
        lastName: lastName || currentUser.lastName,
      };

      const posts = await Post.updateMany({ userId: id },updatedPostData);
      postUpdateMessage = posts.nModified > 0 ? `${posts.nModified} posts updated` : 'No posts to update';
    }

    res.status(200).json({user, postUpdateMessage});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
