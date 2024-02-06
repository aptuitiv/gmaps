module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-custom-media'),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default',
        }),
    ],
};
