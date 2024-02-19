const User = require('../models/user')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt')


exports.createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const userCreate = await User.create({ name, email, password : hashedPassword });
      console.log(userCreate)
      res.status(201).json({ user: userCreate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error or User already exists' });
    }
  };

function generateAccessToken(id,name,premiumuser){
  const jwtToken = jwt.sign({userId : id, name : name, ispremiumuser: premiumuser},'9945B89D9F36B59C7C1BB97FF2F51')
  return jwtToken
}

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
        console.log(email)
  try {
      // Check if the user exists in the database
      const users = await User.findOne({where: {email: email}});
      console.log(users)
      //console.log(user.ispremiumuser)

      if (!users) {
          return res.status(404).json({ message: '404 User not found Please Sign up' });
      }

      //check if password matches after decryption
      const passwordMatch = await bcrypt.compare(password, users.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: '401 User not authorized' });
      }

      res.json({user:users,jwtToken: generateAccessToken(users.id,users.name,users.ispremiumuser)})

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

