import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'src/index.js',
    output: {
      file: 'dist/limited.js',
      format: 'es'
    },
    plugins: [
      uglify()
    ]
  };