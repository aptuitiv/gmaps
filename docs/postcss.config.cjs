// Stops PostCSS from using the library's postcss.config.cjs in the repo root.
// Docusaurus adds its own PostCSS plugins (postcss-preset-env, which includes autoprefixer).
module.exports = {
    plugins: [],
};
