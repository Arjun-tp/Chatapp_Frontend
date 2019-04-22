const urls = {
    local: 'http://127.0.0.1:3005',
};
const env = "local";
module.exports = {
    baseUrl: urls[env]
};