import { nodeResolve } from '@rollup/plugin-node-resolve';
import litcss from 'rollup-plugin-lit-css';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/rebound-embed.js',
  output: {
    file: 'dist/rebound-embed.js',
    format: 'iife',
    name: 'ReboundEmbed'
  },
  plugins: [
    litcss({ include: ['**/*.css'] }),
    nodeResolve(),
    terser()
  ]
};
