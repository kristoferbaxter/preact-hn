module.exports = function(context) {
  const env = context.cache(() => process.env.BABEL_ENV);
  const isServer = env === 'server';
  const transformAsyncAwait = env === 'fallback' || isServer;

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

  const dynamicImport = ['syntax-dynamic-import'];
  const classProperties = ['transform-class-properties']; // Unused since TypeScript handles this for now.
  const blockScoping = ['transform-es2015-block-scoping', {throwIfClosureRequired: true}];
  const transformJSX = ['transform-react-jsx', {pragma: 'h', useBuiltIns: true}];
  const fastAsync = ['fast-async', {spec: true}];

  return {
    presets: [
      [
        'env',
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
    plugins: transformAsyncAwait
      ? [fastAsync, dynamicImport, blockScoping, transformJSX]
      : [dynamicImport, blockScoping, transformJSX],
  };
};
