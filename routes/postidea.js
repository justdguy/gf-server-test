const router = require('express').Router();
const Idea = require('../models/Idea');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({
  accessKeyId: "AKIAIOXZR4FUFDIS4UVA", secretAccessKey: "C9pRotfd2nLAwHXrQZBVfgFcbUiag6mrPjM3GSUs" });

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cardinalwebapplication',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});


router.route('/ideas')
  .get(checkJWT, (req, res, next) => {
    Idea.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, ideas) => {
        if (ideas) {
          res.json({
            success: true,
            message: "Ideas",
            ideas: ideas
          });
        }
      });
  })
  .post([checkJWT, upload.single('idea_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let idea = new Idea();
    idea.owner = req.decoded.user._id;
    idea.category = req.body.categoryId;
    idea.title = req.body.title;
    idea.description = req.body.description;
    //idea.image = req.file.location;
    idea.save();
    res.json({
      success: true,
      message: 'Successfully Added the idea'
    });
  });

/* Just for testing */
router.get('/faker/test',(req, res, next) => {
  for (i = 0; i < 20; i++) {
    let product = new Idea();
    product.category = "5ab0593ae440163ebc285e4c";
    product.owner = "5ab02848968eea111c09afc1";
    product.image = faker.image.technics();
    product.title = faker.commerce.productName();
    product.description = faker.lorem.words();
    product.save();
  }

  res.json({
    message: "Successfully added 20 pictures"
  });

});



module.exports = router;
