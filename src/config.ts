import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig
} from "./types/config"

import type { FriendLink } from "./types/friend"

export const siteConfig: SiteConfig = {
    title: "zuige's blog",
    subTitle: "Welcome to my blog",

    favicon: "zuige.png", // Path of the favicon, relative to the /public directory

    pageSize: 6, // Number of posts per page
    toc: {
        enable: true,
        depth: 3 // Max depth of the table of contents, between 1 and 4
    },
    blogNavi: {
        enable: true // Whether to enable blog navigation in the blog footer
    },
    comments: {
        enable: false, // Whether to enable comments
        platform: "default",
        backendUrl: ""
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true, // Whether to enable PhotoSwipe for image viewer
        postCard: {
            imageMode: "top" // Cover image mode for article cards: "top" shows the image above the content; "background" uses the image as the card background, fading to transparent from right to left
        }
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "/zuige.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    name: "zuige",
    description: "A blog about technology and life",
    indexPage: "https://zuige66.github.io/astro",
    startYear: 2024,
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const friendLinkConfig: FriendLink[] = [
    {
        name: 'zuige',
        avatar: 'https://zuige.cc.cd/images/avatar.jpg',
        url: 'https://zuige.cc.cd',
        description: 'A blog about technology and life'
    }
]
