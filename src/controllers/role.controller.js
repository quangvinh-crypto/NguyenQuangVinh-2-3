const Role = require("../models/role.model");

function buildDuplicateMessage(error) {
  if (error?.code !== 11000) return null;
  const field = Object.keys(error.keyPattern || {})[0] || "field";
  return `${field} already exists`;
}

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.create({ name, description });
    return res.status(201).json({ message: "Role created", data: role });
  } catch (error) {
    const duplicateMsg = buildDuplicateMessage(error);
    if (duplicateMsg) {
      return res.status(409).json({ message: duplicateMsg });
    }
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.json({ data: roles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.json({ data: role });
  } catch (error) {
    return res.status(400).json({ message: "Invalid role id" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json({ message: "Role updated", data: role });
  } catch (error) {
    const duplicateMsg = buildDuplicateMessage(error);
    if (duplicateMsg) {
      return res.status(409).json({ message: duplicateMsg });
    }
    return res.status(400).json({ message: error.message || "Invalid role id" });
  }
};

exports.softDeleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json({ message: "Role soft deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid role id" });
  }
};
