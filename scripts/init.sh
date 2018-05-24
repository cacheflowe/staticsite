#!/bin/bash

cd ..

npm init
npm i grunt --save-dev
npm i -g grunt-cli --save-dev
npm i grunt-contrib-uglify --save-dev
npm i grunt-contrib-concat --save-dev
npm i grunt-contrib-cssmin --save-dev
npm i grunt-postcss pixrem autoprefixer cssnano postcss-import postcss-url postcss-cssnext postcss-browser-reporter postcss-reporter --save-dev
npm i babel-core --save-dev
npm i grunt-babel babel-preset-es2015 --save-dev
npm i grunt-contrib-clean --save-dev
npm i grunt-contrib-copy --save-dev
