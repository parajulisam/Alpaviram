import db from "../models/index.js";

const User = db.user;

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { user_id: req.user.id } });

    // @ NOTE: 0 = user, 1 = admin
    if (user.role !== 1)
      return res.status(500).json({ msg: "Admin resources access denied!" });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default authAdmin;
