import {
  loginService,
  signUpService,
  updateProfilePicService,
} from "../service/auth.service.js";

export const signup = async (req, res) => {
  try {
    const response = await signUpService(req.body, res);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error while signup: ", error);
    res.status(500).json({ message: "Internal server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const response = await loginService(req.body, res);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Your are successfully logged out." });
};

export const updateProfilePic = async (req, res) => {
  try {
    const { profile_pic } = req.body;
    const userId = req.user.id;

    const response = await updateProfilePicService({ profile_pic, userId });

    res
      .status(200)
      .json({
        message: "Successfully updated message.",
        profile_pic: response,
      });
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
