const blogModel = require('../models/bolgModel')
const authorModel = require('../models/authorModel')
const {idCharacterValid,isValidString} = require("../validator/validator");

/***********************************************For create author************************************************************/
const createBlog = async function (req, res) {
  try {
    const data = req.body
    let id = data.authorId
    if (Object.keys(data).length == 0) return res.status(400).send({status: false,msg: "request body is Empty"
    })
    const {title,body,authorId,category} = data

    if (!title) return res.status(400).send({
      status: false,
      msg: "title is required"
    });
    if (!body) return res.status(400).send({
      status: false,
      msg: "body is required"
    });
    if (!authorId) return res.status(400).send({
      status: false,
      msg: "authorId is required"
    });
    if (!category) return res.status(400).send({
      status: false,
      msg: "category is required"
    });

    if (!isValidString(title)) return res.status(400).send({
      status: false,
      msg: "Please provide valid title"
    })
    if (!isValidString(body)) return res.status(400).send({
      status: false,
      msg: "Please provide valid body"
    })
    if (!isValidString(category)) return res.status(400).send({
      status: false,
      msg: "Please provide valid category"
    });

    if (!idCharacterValid(authorId)) return res.status(400).send({
      status: false,
      msg: "Please provide the valid authorid"
    })
    const authordata = await authorModel.findById(id)
    if (!authordata) return res.status(400).send({
      status: false,
      msg: "author Id doesn't exist"
    })

    const savedData = await blogModel.create(data)
    return res.status(201).send({status: true,data: savedData})
  } catch (error) {
    return res.status(500).send({
      status: false,
      msg: error.message
    })
  }
}

/***********************************************For get all blogs************************************************************/
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find(req.query);
    res.status(200).json({
      status: true,
      result: `${blogs.length} blogs found!`,
      blogs,
    });
  } catch (error) {
    res.status(404).json({
      status: "Not found",
      error: error.message,
    });
  }
};

/***********************************************For update blogs by id************************************************************/

const updateBlog = async (req, res) => {
  req.body.isPublished = true;
  req.body.publishedAt = new Date();
  try {
    const blog = await blogModel.findOneAndUpdate({
      _id: req.params.blogId,
      isDeleted: false
    }, {
      $set: req.body,
    }, {
      new: true,
    });


    if (blog) {
      res.status(200).send({
        status: true,
        data: blog
      })
    } else {
      res.status(404).send({
        status: false,
        msg: `${req.params.blogId} id not found!`
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

/***************************************Update blogs using path params************************************************************/
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findOneAndUpdate({
      _id: req.params.blogId,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true,
        deletedAt: new Date()
      },
    }, {
      new: true,
    });

    if (blog) {
      res.status(200).send({
        status: true,
        msg: blog
      })
    } else {
      res.status(404).send({
        status: false,
        msg: `${req.params.blogId} id not found!`
      })
    }
  } catch (error) {
    res.status(500).json({
      status: flase,
      error: error.message
    });
  }
};

/***************************************Update blogs using query params************************************************************/
const deleteBlogQuery = async (req, res) => {
  try {
    const blogs = await blogModel.updateMany(req.query, {isDeleted: true}, {new: true});

    if (blogs) {
      res.status(200).send({
        status: true,
        msg: `${blogs.modifiedCount} blog deleted success!`
      })
    } else {
      res.status(404).send({
        status: false,
        msg: "blog not found"
      })
    }
  } catch (error) {
    res.status(500).json({
      status: flase,
      error: error.message
    });
  }
};





module.exports.updateBlog = updateBlog
module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery=deleteBlogQuery