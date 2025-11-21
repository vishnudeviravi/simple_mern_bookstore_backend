const express = require('express');
const router = express.Router();
const User = require('../db/models/user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.post('/user/sign-up', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already taken' });
    }
    if (password != confirmPassword) {
      return res.status(400).json({ message: 'Passwords doesnt match' });
    }
    const hashedPassword = await bcrypt.hash(password, 2);

    const dbResponse = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Account created' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email or Password incorrect' });
    }
    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return res.status(400).json({ message: 'Email or Password incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({ message: 'Logged In', token });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post('/user/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email incorrect' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY_RESET,
      {
        expiresIn: '1h',
      }
    );

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'programlearn8@gmail.com',
        pass: 'xvxb nwyo rxkt gewz',
      },
    });

    let mailOptions = {
      from: 'programlearn8@gmail.com',
      to: email,
      subject: 'RESET PASSWORD MAIL',
      text: `Hi, 
      Please Reset your password with this token ${token}
      http://localhost:5173/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ message: 'Mail has been sent' });
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post('/user/reset-password', async (req, res) => {
  try {
    const { password, confirmPassword, token, email } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY_RESET);
    const user = await User.findOne({ email });
    if (user._id != decoded.id) {
      return res.status(400).json({ message: 'Invalid Token' });
    }
    if (password != confirmPassword) {
      return res.status(400).json({ message: 'Passwords doesnt match' });
    }

    const hashedPassword = await bcrypt.hash(password, 2);

    const dbResponse = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    return res.status(200).json({ message: 'Password reset' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.patch('/user/:id/address', async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const user = await User.findById(id);
    user.address.push(body);
    await user.save();
    return res.status(200).json({ message: 'New address added' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.patch('/user/:userId/address/:addressId', async (req, res) => {
  try {
    const { houseName, city, pincode } = req.body;
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    let address = user.address.id(addressId);

    if (houseName) address.houseName = houseName;
    if (city) address.city = city;
    if (pincode) address.pincode = pincode;
    console.log(address);

    // address.houseName = 'abc';
    await user.save();
    return res.status(200).json({ message: 'New address added' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.delete('/user/:userId/address/:addressId', async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    let address = user.address.id(addressId);

    address.deleteOne();
    await user.save();
    return res.status(200).json({ message: 'Address added' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
