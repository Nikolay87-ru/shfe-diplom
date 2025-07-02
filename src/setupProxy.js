const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'https://shfe-diplom.neto-server.ru',
      changeOrigin: true
    })
  );
};