export default {
    input: 'lib/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs'
        },
        {
            file: 'dist/index.es.js',
            format: 'es'
        },
    ],
    external: [
        'oidc-client',
        'react',
        'react-router-dom',
    ],
};