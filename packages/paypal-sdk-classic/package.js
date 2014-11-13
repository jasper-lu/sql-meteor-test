Package.describe({
    summary: "Paypal integration with meteor",
    version: "0.0.0"
});

Npm.depends({
    "paypal-classic-sdk" : "https://github.com/trainerbill/paypal-classic-sdk/archive/16e603bd272a093d8862aef1ca79a0fc6112cd0c.tar.gz"
});

Package.onUse(function(api) {
    api.addFiles("server/paypal.js", ["server"]);
    api.export("paypal_classic", ["server"]);
});

