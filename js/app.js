require.config({
  paths: {
      "jquery": "jquery.min",
  },
  "shim": {
    "jquery.mCustomScrollbar.min": ["jquery"],
    "jquery.mousewheel.min": ["jquery"],
    "jquery.colorbox-min": ["jquery"],
    "jquery.scrollTo.min": ["jquery"],
    "draggableimg": ["jquery"],
  },
  waitSeconds: 40
});

requirejs(["main"]); 


// for PROD
// requirejs(["../dist/js/main.min"]);