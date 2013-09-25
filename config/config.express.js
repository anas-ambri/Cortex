var express = require('express'),
    path = require('path');

module.exports = function (app, config) {

    app.set('showStackError', true)

    app.use(express.favicon())
    app.use(express.static(config.root + '/public'))

    // don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
	app.use(express.logger('dev'))
    }

    // set views path, template engine and default layout
    app.set('port', process.env.PORT || config.port)
    app.set('views', config.root + '/app/views')
    app.set('view engine', 'ejs')

    app.configure(function () {
	app.use(express.cookieParser())

	// bodyParser should be above methodOverride
	app.use(express.bodyParser())
	app.use(express.methodOverride())

	app.use(app.router)

	app.use(require('stylus').middleware(config.root + '/public/css/'));
	app.use(express.static(path.join(config.root, 'public')));

	// assume "not found" in the error msgs
	// is a 404. this is somewhat silly, but
	// valid, you can do whatever you like, set
	// properties, use instanceof etc.
	app.use(function(err, req, res, next){
	    // treat as 404
	    if (err.message
		&& (~err.message.indexOf('not found')
		    || (~err.message.indexOf('Cast to ObjectId failed')))) {
		return next()
	    }

	    // log it
	    // send emails if you want
	    console.error(err.stack)

	    // error page
	    res.status(500).render('500', { error: err.stack })
	})

	// assume 404 since no middleware responded
	app.use(function(req, res, next){
	    res.status(404).render('404', {
		url: req.originalUrl,
		error: 'Not found'
	    })
	})
    })
}
