1. Run this command line in the terminal: export NODE_OPTIONS=--openssl-legacy-provider
2. Run this command line in the terminal: npm start
3. In the browser, check localhost:9000
4. In the terminal: control + c to exit
Since this app is not using Redux toolkit, in configureStore.js it needs to createStore for reducer and also have devToolsEnhancer funtion.