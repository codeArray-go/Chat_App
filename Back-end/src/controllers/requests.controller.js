import User from "../models/User.js";
import Request from "../models/Request.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { request } from "express";

export const requestSended = async (req, res) => {
  const { receiverId } = req.body;
  const myId = req.user._id;

  try {
    if (!receiverId || receiverId === myId) return;
    const recieverIdExist = await User.exists({ _id: receiverId })
    if (!recieverIdExist) {
      res.status(404).json({ message: "User with this id not founded." })
    }
    const newRequest = new Request({
      senderId: myId,
      receiverId,
      request: true,
    })

    await newRequest.save();
    res.status(200).json(newRequest);
  } catch (error) {
    console.log("Error in sending Request: ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const gotFriendRequests = async (req, res) => {
  const myId = req.user._id;

  if (!myId) return;

  try {
    const findfriendRequest = await Request.aggregate([
      {
        $match: {
          receiverId: myId,
          request: true,
        }
      },
      {
        $group: {
          _id: "$senderId",
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",        // _id in User collection
          as: "sender"
        }
      },
      {
        $unwind: "$sender"            // convert array → object
      },
      {
        $project: {
          _id: 0,
          senderId: "$sender._id",
          fullName: "$sender.fullName",
          profilePic: "$sender.profilePic"
        }
      }
    ]);

    res.status(200).json(findfriendRequest);
  } catch (error) {
    console.log("Error in sending Request: ", error.message);
    res.status(500).json({ message: "Internal server Error." })
  }
}
