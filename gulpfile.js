'use strict'

const path = require('path');
const gulp = require('gulp') //Gulp
const sourcemaps = require('gulp-sourcemaps') //Mapea codigo SASS para debug no console
const sass = require('gulp-sass')(require('node-sass')) //SASS
const autoprefixer = require('autoprefixer') //Aplica prefixo de navegadores antigos
const postcss = require('gulp-postcss') //PostCSS
const cssnano = require('cssnano') //Minifica css
const mqpacker = require('css-mqpacker') //Unifica todas as @medias da mesma condição em apenas uma
const babel = require('gulp-babel') //Transpila arquivos js para versões antigas do ES
const terser = require('gulp-terser') //Minifica os arquivos js
const image = require('gulp-image') //Otimiza as imagens
const webp = require('gulp-webp') //transforma imagens para o formato webp
const changed = require('gulp-changed') //Verifica se houve alterações
const rename = require('gulp-rename') // Renomeia arquivos
const browserSync = require('browser-sync').create() //Synca os arquivos com o browser e faz o proxy reverso dos arquivos
const browserify = require('browserify') //Converte commonJs para ES
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babelify = require('babelify') //Transpila arquivos js para versões antigas do ES
const glob = require('glob') //Possibilita o uso da escrita do terminal no browserify
const replace = require('gulp-replace') //Substitui textos de arquivos
const replaceName = require('gulp-replace-name') //Substitui nome de arquivos
const clean = require('gulp-clean') //Deleta diretorios ou arquivos
const tsify = require('tsify')
const fileinclude = require('gulp-file-include')
const opn = require('opn');
const connect = require('gulp-connect');

const config = {
	nickName: 'Bubowl',
	accountDomain: 'bubowl',
	https: false,
	url_false: 'http://localhost:8080/',
	url: ''
}
const paths = {
	dist: {
		dest: '/'
	},
	styles: {
		input: './src/scss/*.scss',
		dest: './build/css/',
		src: './src/scss/**/*.scss'
	},
	scripts: {
		input: './src/scripts/*.js',
		dest: './build/js/',
		src: './src/script/**/*.js'
	},
	images: {
		src: './src/images/*',
		dest: './build/img/'
	},
	templates: {
		init: './src/templates/pages/**.html',
		dest: './build/'
	}
}

gulp.task('fileinclude', async () => {
	gulp.src([paths.templates.init])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(replace('{{url}}', config.url))
		.pipe(replace('{{name}}', config.nickName))
		.pipe(gulp.dest(paths.templates.dest))
		.pipe(connect.reload())
})

gulp.task('fileinclude_dev', async () => {
	gulp.src([paths.templates.init])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(replace('{{url}}', config.url_false))
		.pipe(replace('{{name}}', config.nickName))
		.pipe(gulp.dest(paths.templates.dest))
		.pipe(connect.reload())
})

gulp.task('style', () => {
	let processors = [autoprefixer, cssnano, mqpacker]
	return gulp
		.src(paths.styles.input)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(rename(`style.css`))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
})

gulp.task('style-dev', () => {
	let processors = [autoprefixer, mqpacker]
	return gulp
		.src(paths.styles.input)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(rename(`style.css`))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(connect.reload())
})

gulp.task('script', () => {
	let testFiles = glob.sync(paths.scripts.input)
	return browserify({
		entries: testFiles
	})
		.plugin(tsify)
		.transform(
			babelify.configure({
				presets: ['@babel/env']
			})
		)
		.bundle()
		.pipe(source(`script.js`))
		.pipe(buffer())
		.pipe(
			terser({
				toplevel: true
			})
		)
		.pipe(gulp.dest(paths.scripts.dest))
})

gulp.task('script-dev', function () {
	let testFiles = glob.sync(paths.scripts.input)
	return browserify({
		entries: testFiles
	})
		.plugin(tsify)
		.transform(
			babelify.configure({
				presets: ['@babel/env']
			})
		)
		.bundle()
		.pipe(source(`script.js`))
		.pipe(buffer())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(connect.reload())
})

gulp.task('image-minify', function () {
	return gulp
		.src(paths.images.src)
		.pipe(changed(paths.images.src))
		.pipe(image())
		.pipe(gulp.dest(paths.images.dest))
		.pipe(connect.reload())
})

gulp.task('transformto-webp', function () {
	return gulp
		.src(paths.images.src)
		.pipe(changed(paths.images.src))
		.pipe(webp())
		.pipe(gulp.dest(paths.images.dest))
		.pipe(connect.reload())
})
const watchDev = () => {
	gulp.watch(paths.styles.src, gulp.series('style-dev')).on('change', () => {
		browserSync.notify('Reinjetando estilos...', 3000)
		browserSync.reload('*.css')
	})
	gulp.watch(paths.scripts.src, gulp.series('script-dev')).on('change', browserSync.reload)
	gulp.watch(paths.templates.init, gulp.series('fileinclude')).on('change', () => {
		browserSync.reload('*.html')
	})
}

gulp.task('connect', function () {

	connect.server({ livereload: true,
		root: './build/', });
	opn('http://localhost:8080');
});

gulp.task(
	'dev',
	gulp.parallel('fileinclude_dev', 'style-dev', 'script-dev', 'image-minify', 'transformto-webp', 'connect', watchDev)
)
gulp.task(
	'build',
	gulp.parallel('fileinclude', 'style', 'script', 'image-minify', 'transformto-webp')
)