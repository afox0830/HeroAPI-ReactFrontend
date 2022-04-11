const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/heroes",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7146',
        secure: false
    });

    app.use(appProxy);
};
