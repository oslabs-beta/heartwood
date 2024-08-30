will be updated later.

save her
"start": "electron .",
    "build": "webpack --config webpack.config.js",
    "dev": "concurrently \"npx cross-env NODE_ENV=development npx webpack serve --config webpack.config.js\" \"npx cross-env NODE_ENV=development npx nodemon --watch src/main/main.js --exec electron .\""