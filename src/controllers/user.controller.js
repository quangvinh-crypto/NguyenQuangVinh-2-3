const User = require("../models/user.model");

function buildDuplicateMessage(error) {
  if (error?.code !== 11000) return null;
  const field = Object.keys(error.keyPattern || {})[0] || "field";
  return `${field} already exists`;
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const plain = user.toObject();
    delete plain.password;

    return res.status(201).json({ message: "User created", data: plain });
  } catch (error) {
    const duplicateMsg = buildDuplicateMessage(error);
    if (duplicateMsg) {
      return res.status(409).json({ message: duplicateMsg });
    }
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password")
      .populate("role")
      .sort({ createdAt: -1 });

    return res.json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: user });
  } catch (error) {
    return res.status(400).json({ message: "Invalid user id" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated", data: user });
  } catch (error) {
    const duplicateMsg = buildDuplicateMessage(error);
    if (duplicateMsg) {
      return res.status(409).json({ message: duplicateMsg });
    }
    return res.status(400).json({ message: error.message || "Invalid user id" });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User soft deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid user id" });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase(), username, isDeleted: false },
      { status: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found or information is incorrect" });
    }

    return res.json({ message: "User enabled", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase(), username, isDeleted: false },
      { status: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found or information is incorrect" });
    }

    return res.json({ message: "User disabled", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
