const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');

const config = {
    output: {
        filename: 'main.js'
    }
};

module.exports = config;