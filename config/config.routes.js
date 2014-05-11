var routes = require('../app/routes/');

module.exports = function(app) {
    app.get('/', routes.index);
    app.get('/history', routes.history);
};

