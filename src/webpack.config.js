const path = require("path");
const HWP = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "/src/index.js"),
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HWP({
      template: path.join(__dirname, "/src/index.html"),
    }),
  ],
};
