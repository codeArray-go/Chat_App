export const ValidatorForSignUp = ({ full_name, email, password }) => {
  if (!full_name || !email || !password) {
    return "All field are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password should be atleat of 6 characters";
  }

  return null;
};

export const ValidatorForLogin = ({ email, password }) => {
  if (!email || !password) {
    return "Invalid credential.";
  }
  return null;
};

export const ValidatorForProfilePicUpdate = ({ profile_pic }) => {
  if (!profile_pic) return "Profile pic is required";
  return null;
};

export const ValidatorforSearchQuery = ({ query }) => {
  if (!query) return "Seach query reqired.";
  return null;
};

export const ValidatorForSendingMessage = ({
  text,
  image,
  sender_id,
  receiver_id,
}) => {
  if (!text && !image) {
    return "Text or image is required.";
  }
  if (sender_id === receiver_id) {
    return "Cannot send messages to yourself.";
  }

  return null;
};
