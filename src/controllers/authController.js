const LoginHistory = require("../models/loginHistoryModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const axios = require('axios')
const qs = require('querystring');
const { getIpDetails, createUserJSON } = require("../utils/helper");
const crypto = require("crypto");
const { passwordResetTemplate } = require("../template/emailTemplates");
const { activationEmailTemplate } = require("../template/activationEmailTemplate");
const sendEmail = require('../utils/mailer');
const SECRET_KEY = "TECHNIANS"
const bcrypt = require("bcrypt");
const { createCampaignConfig, updateMainScript } = require("../utils/createScript");
const { createMainScript } = require("../utils/scriptUtils");
const packageModel = require("../models/packageModel");


exports.login = async (req, res, next) => {
  try {
    const { email, password, IP } = req.body;

    if (!email) {
      return next(new ErrorHandler('Please enter email.'))
    }
    if (!password) {
      return next(new ErrorHandler('Please enter password.'))
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return next(new ErrorHandler('Invalid credentials.', 401))
    }

    if (user.isDeleted) {
      return next(new ErrorHandler('Your account is deactivated. Do you want to activate it?.', 403));
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return next(new ErrorHandler('Invalid credentials.', 401))
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY);

    const getDetails = await getIpDetails(IP);

    const loginPayload = {
      loginTime: moment().utc().format(),
      userId: user._id,
      ip: IP,
      authType: 'Login',
      method: 'Form',
      city: getDetails.city || "",
      state: getDetails.region_name || "",
      country: getDetails.country_name || ""
    };
    await LoginHistory.create(loginPayload);
    return res.json({
      success: true,
      message: "User login successfully",
      user,
      token,
    });
  } catch (error) {
    return next(error)
  }
};


exports.me = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return next(new ErrorHandler('Unauthorized', 401))
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    return next(error)
  }
}

exports.signUp = async (req, res, next) => {
  try {
    const { email, website, IP } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const websiteData = {
      website,
      isPrimary: true,
      isActive: true
    };

    const payload = {
      ...req.body,
      websites: [websiteData],
    };

    user = await User.create(payload);
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });

    const getDetails = await getIpDetails(IP);
    await createMainScript(user)
    // await createCampaignConfig(user)
    const loginPayload = {
      loginTime: moment().utc().format(),
      userId: user._id,
      ip: IP,
      authType: 'Signup',
      method: 'Form',
      city: getDetails.city || "",
      state: getDetails.region_name || "",
      country: getDetails.country_name || ""
    };
    await LoginHistory.create(loginPayload);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
};

exports.loginHistory = async (req, res, next) => {
  try {
    let { page, limit, ip, authType, city, email, method } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (ip) filter.ip = { $regex: ip, $options: "i" };
    if (authType) filter.authType = { $regex: authType, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (method) filter.method = { $regex: method, $options: "i" };

    let historyQuery = LoginHistory.find(filter)
      .populate({
        path: "userId",
        select: "_id firstName lastName email role",
        match: email ? { email: { $regex: email, $options: "i" } } : {},
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let history = await historyQuery;

    history = history.filter((entry) => entry.userId !== null);

    const totalRecords = await LoginHistory.countDocuments(filter);

    res.json({
      success: true,
      data: history,
      total: totalRecords,
      pages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return next(error);
  }
};

exports.loginHistoryById = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let { page, limit, ip, authType, city, email, method } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { userId: _id };

    if (ip) filter.ip = { $regex: ip, $options: "i" };
    if (authType) filter.authType = { $regex: authType, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (method) filter.method = { $regex: method, $options: "i" };

    let historyQuery = LoginHistory.find(filter)
      .populate({
        path: "userId",
        select: "_id firstName lastName email role",
        match: email ? { email: { $regex: email, $options: "i" } } : {},
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let history = await historyQuery;

    history = history.filter((entry) => entry.userId !== null);

    const totalRecords = await LoginHistory.countDocuments(filter);

    res.json({
      success: true,
      data: history,
      total: totalRecords,
      pages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return next(error);
  }
};


exports.googleAuth = async (req, res, next) => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email&access_type=offline`;
    res.redirect(url);
  } catch (error) {
    return next(error);
  }
};


exports.loginWithGoogle = async (req, res, next) => {

  const { code } = req.query;

  if (!code) {
    return next(new ErrorHandler('Authorization code not provided.'));
  }

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token',
      qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = data;

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await User.findOne({ email: profile.email });

    const [fName, lName] = profile.name.split(' ');
    if (!user) {
      user = new User({
        firstName: fName,
        lastName: lName,
        email: profile.email,
        password: '12345678',
      });
      await user.save();
    }

    const ipData = await fetch('https://api.ipify.org?format=json');
    const convertIp = await ipData.json();

    const getDetails = await getIpDetails(convertIp?.ip);

    const loginPayload = {
      loginTime: moment().utc().format(),
      userId: user._id,
      ip: convertIp?.ip,
      authType: 'Login',
      method: 'Form',
      city: getDetails.city || "",
      state: getDetails.region_name || "",
      country: getDetails.country_name || ""
    };
    await LoginHistory.create(loginPayload);

    const token = jwt.sign({ userId: user._id }, SECRET_KEY);
    console.log("'https://urlpt.technians.in?token=' + token", 'https://urlpt.technians.in?token=' + token);

    res.redirect('https://urlpt.technians.in?token=' + token)
  } catch (error) {
    return next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    let updateFields = { ...req.body };

    delete updateFields.email;
    delete updateFields.password;

    const updatedUser = await User.findByIdAndUpdate(_id, updateFields, { new: true });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    return next(error);
  }
};



exports.forgotPassword = async (req, res, next) => {

  try {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Please provide an email address.", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found with this email.", 404));

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail(user.email, "Password Reset Request", passwordResetTemplate((user.firstName + user.lastName), resetUrl));

    console.log(user?.email)

    res.status(200).json({
      success: true,
      message: "Please check the password reset link sent to your email.",
    });

  } catch (error) {
    return next(error);
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) return next(new ErrorHandler("Invalid or expired token.", 400));
    if (!newPassword) return next(new ErrorHandler("Please provide a new password.", 400));

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }
    });


    if (!user) return next(new ErrorHandler("Invalid or expired token.", 400));

    user.password = newPassword;
    user.passwordChangeAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in."
    });

  } catch (error) {
    return next(error);
  }
};


// exports.getUserWebsites = async (req, res, next) => {
//   const { _id } = req.user;
//   const user = await User.findById(_id).select("websites");

//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }

//   // Filter only active websites
//   const activeWebsites = user.websites.filter((site) => site.isActive);

//   res.status(200).json({
//     success: true,
//     websites: activeWebsites,
//   });
// };


exports.addWebsite = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { website, isPrimary, isActive } = req.body;

    if (!website) {
      return next(new ErrorHandler("Website URL is required", 400));
    }

    const user = await User.findById(_id).select("websites");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const updatedWebsites = user.websites.map((w) => ({
      ...w.toObject(),
      isPrimary: isPrimary ? false : w.isPrimary,
    }));

    updatedWebsites.push({
      website: website.trim(),
      isPrimary: isPrimary || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    await User.updateOne({ _id }, { websites: updatedWebsites });

    res.status(200).json({
      success: true,
      message: "Website added successfully",
      websites: updatedWebsites,
    });
  } catch (error) {
    next(error);
  }
};


exports.makePrimaryWebsite = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { websiteId } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    let isAlreadyPrimary = false;
    let primaryUpdated = false;

    const updatedWebsites = user.websites.map((site) => {
      if (site._id.toString() === websiteId) {
        if (site.isPrimary) {
          isAlreadyPrimary = true;
        } else {
          site.isPrimary = true;
          primaryUpdated = true;
        }
      } else {
        site.isPrimary = false;
      }
      return site;
    });

    if (isAlreadyPrimary) {
      return next(new ErrorHandler("Website is already primary", 400));
    }

    if (!primaryUpdated) {
      return next(new ErrorHandler("Website not found", 404));
    }

    await User.updateOne(
      { _id },
      { $set: { websites: updatedWebsites } }
    );

    res.status(200).json({
      success: true,
      message: "Primary website updated successfully",
      websites: updatedWebsites,
    });
  } catch (error) {
    next(error);
  }
};


exports.deactivateWebsite = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { websiteID } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const website = user.websites.find((site) => site?._id?.toString() === String(websiteID));
    if (!website) {
      return next(new ErrorHandler("Website not found", 404));
    }

    const updatedWebsites = user.websites.map((site) =>
      site._id.toString() === websiteID ? { ...site.toObject(), isActive: !site.isActive } : site
    );

    const updatedUser = await User.findOneAndUpdate({ _id }, { $set: { websites: updatedWebsites } }, { new: true });
    await updateMainScript(updatedUser)
    res.status(200).json({
      success: true,
      message: `Website ${website.isActive ? "activated" : "deactivated"} successfully`,
      websites: updatedWebsites,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteWebsite = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { websiteID } = req.body;

    const result = await User.updateOne(
      { _id },
      { $pull: { websites: { _id: websiteID } } }
    );

    if (result.modifiedCount === 0) {
      return next(new ErrorHandler("Website not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Website deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutHistory = async (req, res, next) => {

  try {
    const { _id } = req.user;
    const { IP, method } = req.body;

    const getDetails = await getIpDetails(IP);

    const loginPayload = {
      loginTime: moment().utc().format(),
      userId: _id,
      ip: IP,
      authType: 'Logout',
      method: method ? method : 'Manual',
      city: getDetails.city || "",
      state: getDetails.region_name || "",
      country: getDetails.country_name || ""
    };
    await LoginHistory.create(loginPayload);
    return res.json({
      success: true,
      message: "Logout history created successfully",
    });

  } catch (error) {
    return next(error)
  }

}


exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!userId) return next(new ErrorHandler("Unauthorized access.", 400));

    if (!oldPassword || !newPassword) return next(new ErrorHandler("All fields are required.", 400));

    const user = await User.findById(userId).select("+password");

    if (!user) return next(new ErrorHandler("User not found.", 400));

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return next(new ErrorHandler("Incorrect old password.", 400));

    user.password = newPassword;
    user.passwordChangeAt = new Date();

    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });

  } catch (error) {
    next(error);
  }
};


exports.deleteAccount = async (req, res, next) => {
  try {
    const { _id, role } = req.user;

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins are not allowed to delete their accounts."
      });
    }

    let autoDeletedDays = 30;
    const autoDeletedAt = new Date(Date.now() + autoDeletedDays * 24 * 60 * 60 * 1000);

    const user = await User.findByIdAndUpdate(
      _id,
      { isDeleted: true, autoDeletedAt, autoDeletedDays },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Account marked as deleted. It will be permanently removed after ${autoDeletedDays} days.`,
      data: user
    });

  } catch (error) {
    next(error);
  }
};


exports.activeUser = async (req, res, next) => {
  try {
    const { _id, isDeleted } = req.body;

    const user = await User.findOneAndUpdate(
      { _id },
      { isDeleted: isDeleted },
      { new: true }
    );

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: `Account has been successfully ${isDeleted ? "deactivated" : "activated"}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.activationMail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await User.find({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    await sendEmail(email, 'Account Activation Request', activationEmailTemplate(email));

    res.status(200).json({
      success: true,
      message: "Activation email sent successfully.",
    });

  } catch (error) {
    console.error("Activation Mail Error:", error);
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let { page, limit, firstName, email, role } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (firstName) filter.firstName = { $regex: firstName, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (role) filter.role = { $regex: role, $options: "i" };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutTime = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { time, packagePercentage } = req.body;

    const package = await packageModel.findOne()
    if (package && package._id) {
      if (package.percentage !== packagePercentage) {
        await packageModel.updateMany({ percentage: packagePercentage })
      }
    }




    if (role !== "admin") {
      return next(new ErrorHandler("Access denied. Only admin can set logout time.", 403));
    }
    const result = await User.updateMany({}, { logoutTime: time });

    res.status(200).json({
      success: true,
      message: "Logout time updated for all users by admin.",
      updatedCount: result.modifiedCount || result.nModified,
    });
  } catch (error) {
    next(error);
  }
};

exports.setAutoDeletedDays = async (req, res, next) => {
  try {
    const { autoDeletedDays } = req.body;
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update this setting."
      });
    }

    if (!autoDeletedDays || autoDeletedDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid autoDeletedDays value."
      });
    }

    const autoDeletedAt = new Date(Date.now() + autoDeletedDays * 24 * 60 * 60 * 1000);

    const result = await User.updateMany(
      { isDeleted: true },
      { $set: { autoDeletedDays, autoDeletedAt } }
    );

    res.status(200).json({
      success: true,
      message: `Auto-deletion period updated to ${autoDeletedDays} days.`,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

exports.getAutoDeleteDays = async (req, res, next) => {
  try {
    const result = await User.findOne({ isDeleted: true }).sort({ updatedAt: -1 });

    const autoDeletedDays = result?.autoDeletedDays ?? 30; // Default to 30 if not found

    res.status(200).json({
      success: true,
      autoDeletedDays,
      message: result ? "Auto-deletion setting found." : "Default auto-deletion days used.",
    });
  } catch (error) {
    next(error);
  }
};

//sanjeev code

exports.postEmailOtp = async (req, res, next) => {
  try {


    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ErrorHandler("Please provide an email address and OTP.", 400));
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Dear user,</p>
        <p>Your OTP for email verification is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>Regards,<br/>Official Support Team</p>
      </div>
    `;

    await sendEmail(email, "Email Verification OTP", htmlContent);

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address.",
    });
  } catch (error) {
    return next(error);
  }
};
