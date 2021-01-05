const router = require("express").Router();
let User = require("../models/user");

/**
 * POST new user
 * @param req { _id, password }
 * @return user._id
 */
router.route("/signup").post((req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password,
    imgs: [],
  });

  newUser
    .save()
    .then((user) => res.json(user._id))
    .catch((err) => res.status(400).json("error: " + err));
});

/**
 * GET login user
 * @param req { id }
 * @return user if passwords match, false if passwords do not match
 */
router.route("/login").post((req, res) => {
  const { password, username } = req.body;
  User.findOne({ username: username })
    .then((user) => {
      user.comparePassword(password, function (err, isMatch) {
        // because password is salted
        if (err) return res.status(400).json(err);
        return res.json(isMatch ? user._id : isMatch);
      });
    })
    .catch((err) => res.status(400).json(`Error: User Not Found`));
});

/**
 * GET exisitng user
 * @param req { _id }
 * @return user
 */
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("error: " + err));
});

module.exports = router;
