import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

const config: Config = {
    title: 'Google Maps Display',
    tagline: 'Helpers to display a Google map and map components on your website',
    favicon: 'img/favicon.png',

    // Set the production url of your site here
    url: 'https://aptuitiv.github.io/',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/gmaps/',
    trailingSlash: false, // Set to true if you want to use /<page-name>/ instead of /<page-name>.html

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'aptuitiv', // Usually your GitHub org/user name.
    projectName: 'aptuitiv.github.io', // Usually your repo name.
    deploymentBranch: 'main', // The branch your GitHub pages site is deployed from.

    onBrokenLinks: 'throw',
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                // Docs configuration: https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                    path: 'docs-src',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        // image: "img/docusaurus-social-card.jpg",
        docs: {
            // https://docusaurus.io/docs/sidebar#theme-configuration
            sidebar: {
                autoCollapseCategories: true,
                hideable: true,
            },
        },
        navbar: {
            title: '@aptuitiv/gmaps',
            logo: {
                alt: 'Aptuitiv',
                src: 'img/favicon.png',
            },
            items: [
                // {
                //   type: "docSidebar",
                //   sidebarId: "docs",
                //   position: "left",
                //   label: "Docs",
                // },
                {
                    href: 'https://github.com/aptuitiv/gmaps',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },

        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.aptuitiv.com">Aptuitiv, Inc.</a>`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
