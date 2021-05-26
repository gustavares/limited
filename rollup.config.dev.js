import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.js',
  output: {
    file: './examples/dist/limited.js',
    format: 'es'
  },
  plugins: [
    serve({
      open: true,
      openPage: '/',
      host: 'localhost',
      port: 3030,
      contentBase: './examples',
    }),
    livereload({
      watch: ['./examples', './src']
    }),
  ]
};