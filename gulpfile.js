const gulp = require("gulp"),
      browserSync = require("browser-sync").create(),
      sass = require("gulp-sass"),
      minifyCSS = require("gulp-csso"),
      plumber = require("gulp-plumber"),
      babel = require("gulp-babel"),
      minifyImg = require("gulp-imagemin"),
      minifyJS = require("gulp-uglify-es").default,
      jsConfig = require("./src/scripts/config"),
      htmlmin = require("gulp-htmlmin"),
      concat = require("gulp-concat"),
      autoprefixer = require("gulp-autoprefixer"),
      del = require("del"),
      rename = require("gulp-rename"),
      merge = require("merge-stream"),
      runSequence = require("run-sequence"),
      { src } = require("gulp");

gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
});

gulp.task("css", () => {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "nested",
        precision: 10,
        includePaths: ["."].concat(),
      }).on("error", sass.logError)
    )
    .pipe(minifyCSS())
    .pipe(autoprefixer())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  const all = jsConfig["all"];
  let tasks = all.map((config) => {
    return gulp
      .src(config.src)
      .pipe(plumber())
      .pipe(
        babel({
          presets: ["@babel/preset-env"]
        })
      )
      .pipe(minifyJS())
      .pipe(concat(config.fileName))
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(config.buildLocations))
      .pipe(browserSync.stream());
  });

  return merge(tasks);
});

gulp.task("html", () => {
  gulp
    .src("src/**/*.html")
    //.pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("img", () => {
  gulp
    .src("src/img/**/*")
    // .pipe(minifyImg())
    .pipe(gulp.dest("dist/img"));
});

gulp.task("delete", () =>
  del(["dist/css", "dist/js", "dist/img", "dist/**/*.html"])
);

gulp.task("watch", () => {
  gulp.watch("src/scss/**/*.scss", ["css"]);
  gulp.watch("src/js/**/*.js", ["js"]);
  gulp.watch("src/img/**/*", ["img"]);
  gulp.watch("src/**/*.html", ["html"]);
});

gulp.task("default", () => {
  runSequence("delete", "html", "css", "js", "img", "browser-sync", "watch");
});
