var webpack = require("webpack");
var path = require("path");

// http://webpack.github.io/docs/configuration.html
module.exports = {
	entry:{
		bombato: "./ts/core/index.ts"
	},

	output:{
		path: __dirname + "/html/js/",
		filename: "[name].js"
	},

	resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},

	externals:{
		Hammer: "hammerjs",
		dat: "dat",
		THREE: "three",
		Stats: "stats",
		TweenLite: "TweenLite"
	},

	module:{
		rules: [
			// any file ending in .ts or .tsx that's not in node_modules will use ts-loader to run
            { test: /\.(glsl|vs|fs)$/, loader: "shader-loader" },
            { test: /\.tsx?$/, exclude: [/node_modules/, /tsOld/], loader: "ts-loader" },
		]
	},

	// Enables dev server to be accessed by computers in local network
	devServer: {
		host: "0.0.0.0",
		port: 8080,
		publicPath: "/html/js/",
		disableHostCheck: true
	}
}
