({
    baseUrl: ".",
    paths: {
      "jquery": "jquery.min",
      "requireLib": "require",
    },
    preserveLicenseComments: false,
    name: "app",
    include: "requireLib",
    out: "../dist/app-built.js"
})