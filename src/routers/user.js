const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");
const csvtojson = require("csvtojson");
const csv = require("csv-parser");
const fs = require("fs");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.generateAccountNumber();
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    let msg;
    const token = await user.generateAuthToken();
    if(user.Balance==0){
        msg='Please upload CSV file'
    }
    else{
        msg="Your account is upto Date"
    }
    let name=user.name;
    let email=user.email;
    res.send({ name, email, token ,msg});
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
const msg='You have been logged out of this device. Login again to access your UPI account'
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({msg});
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    const msg='You have been logged out of all devices.See you soon'
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({msg})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/users/me/upload",auth,upload.single("upload"),async (req, res) => {
    const user = req.user;
    const file=req.file;
    updatetData(user,file).then((userDetails) => res.status(200).send({"message":"uploading Successful",userDetails}))
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);


const updatetData = (user,file) => {
    return new Promise((resolve, reject) => {
        console.log("user", user);
        const results = [];
        let sum = 0;
        const monthlyIncome = new Array(12).fill(0);
        count = 0;
        fs.createReadStream(`./uploads/${file.originalname}`)
          .pipe(csv())
          .on("data", (data) => {
            if (count == 0) {
              console.log("balance", data.ClosingBalance);
              user.setBalance(data.ClosingBalance);
              count++;
            }
            let date = new Date(data.Date);
            console.log("date", date);
            if (date.getMonth() == 0) {
              monthlyIncome[0] = monthlyIncome[0] + Number(data.Deposit);
            } else if (date.getMonth() == 1) {
              monthlyIncome[1] = monthlyIncome[1] + Number(data.Deposit);
            } else if (date.getMonth() == 2) {
              monthlyIncome[2] = monthlyIncome[2] + Number(data.Deposit);
            } else if (date.getMonth() == 3) {
              monthlyIncome[3] = monthlyIncome[3] + Number(data.Deposit);
            } else if (date.getMonth() == 4) {
              monthlyIncome[4] = monthlyIncome[4] + Number(data.Deposit);
            } else if (date.getMonth() == 0) {
              monthlyIncome[0] = monthlyIncome[0] + Number(data.Deposit);
            } else if (date.getMonth() == 5) {
              monthlyIncome[5] = monthlyIncome[5] + Number(data.Deposit);
            } else if (date.getMonth() == 6) {
              monthlyIncome[6] = monthlyIncome[6] + Number(data.Deposit);
            } else if (date.getMonth() == 7) {
              monthlyIncome[7] = monthlyIncome[7] + Number(data.Deposit);
            } else if (date.getMonth() == 8) {
              monthlyIncome[8] = monthlyIncome[8] + Number(data.Deposit);
            } else if (date.getMonth() == 9) {
              monthlyIncome[9] = monthlyIncome[9] + Number(data.Deposit);
            } else if (date.getMonth() == 10) {
              monthlyIncome[10] = monthlyIncome[10] + Number(data.Deposit);
            } else if (date.getMonth() == 11) {
              monthlyIncome[11] = monthlyIncome[11] + Number(data.Deposit);
            }
            results.push(data);
          })
    
          .on("end", () => {
            for (let i = 0; i < monthlyIncome.length; i++) {
              sum += monthlyIncome[i];
            }
            let avg = sum / 12;
            let limit = (sum / 12) * 1.2;
            user.setAccountDetails(avg, limit);
            resolve(user);
          });
    });
  };


module.exports = router;
