import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => { 
	//Ищем файлы шрифтов .otf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		//Конвертируем в .ttf
		.pipe(fonter({
			formats: ['ttf']
		}))
		//Выгружаем в исходную папку
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
} 

export const ttfToWoff = () => {
	//Ищем файлы шрифтов .ttf
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		//Конвертируем в .woff
		.pipe(fonter({
			formats: ['woff']
		}))
		//Выгружаем в папку с результатом
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		//Ищем файлы шрифтов .ttf
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
		//Конвертируем в .woff2
		.pipe(ttf2woff2())
		//Вышружаем в папку с результатом 
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export const fontsStyle = () => {
	//Файл стилей подключения шрифтов
   let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
	//Проверяем, существуют ли файлы шрифтов
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			//Проверяем, существует ли файл стилей для подключения шрифтов
         if (!fs.existsSync(fontsFile)) {
				//Если файла нет - создаем его
            fs.writeFile(fontsFile, '', cb);
            let newFileOnly;
            for(var i = 0; i < fontsFiles.lenght; i++) {
					//Записываем подключение шрифтов в файл стилей
               let fontFileName = fontsFiles[i].split('.')[0];
               if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                  let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                  if (fontWeight.toLoweCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLoweCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLoweCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLoweCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLoweCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLoweCase() === 'bold') {
							fontWeight = 700;
						} else if (fontWeight.toLoweCase() === 'extrabold' || fontWeight.toLoweCase() === 'heavy') {
							fontWeight = 800;
						} else if (fontWeight.toLoweCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face{
							font-family: ${fontName};
							font-display: swap;
							src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
							font-weight: ${fontWeight};
							font-style: normal;
						}`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				//Если файл есть - выводим сообщение
				console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!");
			}
		}
	});
	return app.gulp.src(`${app.path.srcFolder}`);
	function cb() {}
}