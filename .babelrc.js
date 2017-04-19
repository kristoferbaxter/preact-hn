module.exports = function(context) {
  const env = context.cache(() => process.env.BABEL_ENV);
  const isServer = env === "build.server";

  let targets = {
    "build.chrome": { chrome: 52 },
    "build.edge": { edge: 14 },
    "build.safari": { safari: 10 },
    "build.firefox": { firefox: 45 },
    "build.server": { node: 6 },
    "build.fallback": {
      browsers: ["last 2 versions", "safari >= 7"]
    },
  };

  return {
    presets: [
      ["env", {
        targets: targets[env],
        modules: isServer ? "commonjs" : false,
        loose: isServer ? false : true,
        // debug: true,
      }]
    ],
    plugins: [
      ["transform-react-jsx", {
        pragma: "h",
        useBuiltIns: true
      }]
    ]
  };
};
