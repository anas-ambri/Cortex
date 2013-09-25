module.exports = function(app) {
    app.get('/', require('../app/routes/index'));
}
