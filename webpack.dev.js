const {merge}=require('webpack-merge');
const common=require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    hot: true,
    open: true,
    watchFiles: ["./src/**/*"],
  },
  module:{
    rules:[
        {
            test:/\.css$/i,
            use:["style-loader","css-loader"],

        },
        {
            test:/\.scss$/i,
            use:["style-loader","css-loader","sass-loader"]
        },
    ],
  },
});
