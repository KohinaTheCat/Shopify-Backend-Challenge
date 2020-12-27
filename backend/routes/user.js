const router = require("express").Router();
let User = require("../models/user");

// POST add new user
router.route("/").post((req, res) => {
  const { _id, password } = req.body;
  const newUser = new User({
    _id,
    password,
    imgs: []
  });

  newUser
    .save()
    .then((user) => res.json(user._id))
    .catch((err) => res.status(400).json("error: " + err));
});

// GET exisitng user
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("error: " + err));
});

// DELETE exisitng user
router.route('/:id').delete((req, res) => {
  User.findById(req.params.id)
  .then(() => res.json("user deleted!"))
  // TODO: delete images coresponding to the user
  .catch(err => res.status(400).json("error: " + err))
})

module.exports = router;