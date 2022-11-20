const notices = require("./../models/noticeModel");
const APIFeatures = require("./../utils/APIFeatures");


exports.createNotice = (req,res)=>{
  res.render("notice.ejs");
}
exports.getAllNotices = async (req, res) => {
  try {
    const query = notices.find();
    let finalQuery = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .paginate()
      .filterFields();

    const notice = await finalQuery.query;

    res.status(200).render("index.ejs", { notice: notice });

    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     notices: notice,
    //   },
    // });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneNotice = async (req, res) => {
  try {
    const query = await notices.find({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        notice: query,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.postNotice = async (req, res) => {
  try {
    let fileLink = req.protocol + "://" + req.headers.host;

    if (req.file) {
      fileLink =
        req.protocol +
        "://" +
        req.headers.host +
        "//noticeFiles//" +
        req.file.filename;
    }
    req.body.email = req.email;
    // console.log(req.email);
    console.log(fileLink);
    req.body.notice_id = "NNDEPT01012022";  
    req.body.download = fileLink;
    const query = await notices.create(req.body);
    // res.status(201).json({
    //   status: "success",
    //   data: {
    //     notice: query,
    //   },
    // });
    res.status(201).redirect("/admin-dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.patchNotice = async (req, res) => {
  try {
    const query = await notices.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        notices: query,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await notices.findByIdAndDelete(req.body.id);
    res.status(204).json({
      status: "success",
      data: {
        notice,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
