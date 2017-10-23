module.exports = (config) => {
  config.set({
      frameworks: ['systemjs', 'jasmine'],
      browsers: ['Chrome', 'Firefox', 'Edge'],
      reporters: ['spec'],
      files: [
        './spec/*.js',
        { pattern: './src/*.js', watched: true, included: false, served: true },
        { pattern: './node_modules/systemjs-plugin-babel/plugin-babel.js', watched: false, included: false, served: true },
        { pattern: './node_modules/systemjs-plugin-babel/systemjs-babel-browser.js', watched: false, included: false, served: true },
        { pattern: './node_modules/systemjs-plugin-babel/babel-helpers/*.js', watched: false, included: false, served: true },
        { pattern: './node_modules/systemjs/dist/system-polyfills.js', watched: false, included: false, served: true },
        { pattern: './node_modules/@webcomponents/webcomponentsjs/*.js', watched: false, included: false, served: true }
      ],
      systemjs: {
        config: {
          baseURL: 'src',
          transpiler: 'plugin-babel',
          babelOptions: {es2015: false},
          map: {
            'plugin-babel': '/base/node_modules/systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': '/base/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
          }
        },
        includeFiles: [
          './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
        ]
      }
  });
};