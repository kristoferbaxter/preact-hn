module.exports = function(context) {
  const env = context.cache(() => process.env.BABEL_ENV);
  const isServer = env === 'server';

  const targets = {
    chrome: {chrome: 59},
    edge: {edge: 15},
    safari: {safari: 11},
    firefox: {firefox: 55},
    server: {node: 6},
    fallback: {
      browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
    },
  };

  const dynamicImport = ['@babel/syntax-dynamic-import'];
  const classProperties = ['@babel/proposal-class-properties']; // Unused since TypeScript handles this for now.
  const blockScoping = ['@babel/transform-block-scoping', {throwIfClosureRequired: true}];
  const destructuring = ['@babel/transform-destructuring'];
  const transformJSX = ['@babel/transform-react-jsx', {pragma: 'h', useBuiltIns: true}];
  const fastAsync = ['fast-async', {spec: true}];

  let plugins = [dynamicImport, blockScoping, transformJSX];
  if (env === 'safari') {
    plugins = [dynamicImport, destructuring, blockScoping, transformJSX];
  } else if (env === 'fallback' || isServer) {
    plugins = [fastAsync, destructuring, dynamicImport, blockScoping, transformJSX];
  }

  return {
    presets: [
      [
        '@babel/env',
        Object.assign(
          {
            targets: targets[env],
            modules: isServer ? 'commonjs' : false,
            loose: !isServer,
            // debug: true,
          },
          isServer
            ? {}
            : {
                exclude: ['transform-regenerator'],
              },
        ),
      ],
    ],
    plugins,
  };
};
