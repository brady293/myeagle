const {src , dest , watch , series , parallel} = require('gulp');


//console.log
function defaultTask(cb) {
    console.log('gulp 安裝成功')
    cb();
  }
  
  exports.default = defaultTask

//a任務
function TaskA(cb) {
    console.log('A任務')
    cb();
}

//b任務
function TaskB(cb) {
    console.log('B任務')
    cb();
}

//非同步
exports.async = series(TaskA , TaskB);

//同步
exports.sync = parallel(TaskA , TaskB);





//src -> dest html
function move(){
    return src('./src/*.html').pipe(dest('dist'))
}
exports.m = move

//js move
function moveJs(){
    return src('src/js/*.js').pipe(dest('dist/js'))
}


//css move
function movecss(){
    return src('css/*.css').pipe(dest('dist/css'))
}

//images move
function moveImg(){
    return src('src/Images/*.*').pipe(dest('dist/images')) 
}

const fileinclude = require('gulp-file-include');

function includeHTML() {
    return src('src/*.html')    
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist'));
}

exports.html = includeHTML;

//gulpfile.js 安裝
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

function styleSass() {
    return src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/css'));
  }



//監看
function watchfile(){
    watch(['src/*.html' , 'src/**/*.html'],includeHTML);   
    watch(['js/*.js'], moveJs)
    // watch('css/*.css',movecss)
    watch(['./src/sass/*.scss','./src/sass/**/*.scss'],styleSass)
}

const browserSync = require('browser-sync');
const reload = browserSync.reload;

//瀏覽器
function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['src/*.html' , 'src/**/*.html'],includeHTML).on('change',reload);   //監看html
    watch(['src/images/*.*','src/images/**/*.*'], moveImg).on('change',reload)
    watch('src/js/*.js', moveJs).on('change',reload)
    // watch('css/*.css',movecss)
    watch(['./src/sass/*.scss','./src/sass/**/*.scss'],styleSass).on('change',reload) //監看sass
    done();
}


//監看
exports.w = series(parallel(moveJs,moveImg,includeHTML,styleSass),watchfile)
//瀏覽器同步
exports.default = series(parallel(moveJs,includeHTML,styleSass,moveImg),browser)

