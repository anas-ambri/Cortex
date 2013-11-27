var path = require('path')
, rootPath = path.normalize(__dirname + '/..');

module.exports = {
    development: {
	db: 'mongodb://localhost/cortex-db_dev',
	root: rootPath,
	port: 3000,
	app: {
	    name: 'Cortex'
	}
    },
    test: {
	db: 'mongodb://localhost/cortex-db_test',
	root: rootPath,
	port : 3000,
	app: {
	    name: 'Cortex'
	}
    },
    production: {}
}
