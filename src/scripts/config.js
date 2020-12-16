const indexConfig = require("./index/config"),
      otherPageConfig = require("./otherpage/config"),
      all = indexConfig.concat(otherPageConfig);

module.exports = {
  all : all,
  index : indexConfig,
  otherpage : otherPageConfig
}      