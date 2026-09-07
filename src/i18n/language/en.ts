import type { Translation } from "@i18n/key";

const translation: Translation = {
    header: {
        home: "Home",
        archive: "Archive",
        about: "About",
        friends: "Friends",
    },
    cover: {
        title: {
            home: "Welcome to zuige's Blog",
            archive: "Archive",
            about: "About",
            friends: "Friends",
        },
        subTitle: {
            home: "Life is colorful!",
            archive: "Total of {count} articles",
            about: "A minimalist blog",
            friends: "Interesting Souls",
        }
    },
    toc: "Contents",
    category: "Category",
    pageNavigation: {
        previous: "Prev",
        next: "Next",
        currentPage: "Page {currentPage} of {totalPages}",
    },
    button: {
        switchDarkMode: "Switch Dark Mode",
        search: "Search",
        close: "Close",
        language: "Change language",
        mobileMenu: "Open menu",
        backToTop: "Back to Top",
        backToBottom: "Back to Bottom",
        meun: "Menu",
        toc: "Contents",
        backToComments: "Back to Comments",
    },
    search: {
        placeholder: "Enter keywords to start searching",
        noresult: "No results found.",
        error: "Search error occurred. Please try again later.",
        unavailable: "Search is temporarily unavailable.",
        devTitle: "Development search preview",
        devDescription: "The Pagefind search index is not loaded in development.",
        devPreviewTitle: "Test search after building",
        devPreviewDescription: "Run npm run build and npm run preview to test the complete search."
    },
    license: {
        author: "Author",
        license: "License",
        publishon: "Published on"
    },
    blogNavi: {
        next: "Next Blog",
        prev: "Previous Blog"
    },
    pagecard: {
        words: "words",
        minutes: "min read",
        uncategorized: "Uncategorized"
    },
    comments: {
        name: "Name",
        email: "Email",
        site: "Website",
        required: "Required",
        optional: "Optional",
        welcome: "Welcome to comment",
        comments: "Comments",
        cancel: "Cancel",
        send: "Send",
        sending: "Sending...",
        reply: "Reply",
        replyPlaceholder: "Write your reply...",
        loadMore: "Load more",
        loading: "Loading comments...",
        loadFailed: "Failed to load",
        submitSuccess: "Submitted successfully",
        submitFailed: "Submission failed, please try again later",
        verificationRequired: "Email verification required. Please check your inbox.",
        fillRequired: "Please fill in name, email and comment content",
        confirmDelete: "Are you sure you want to delete this comment?",
        delete: "Delete",
        deleteSuccess: "Successfully deleted",
        deleteFailed: "Failed to delete",
        deleteError: "Failed to delete comment",
        characters: "characters",
        words: "words",
        contentTooLong: "Comment content exceeds limit: no more than 2000 characters or 1000 words",
        replyTo: "reply to",
        write: "Write",
        preview: "Preview",
        previewError: "Markdown syntax error",
        codeFence: "Unclosed code block (```)",
        inlineCode: "Unclosed inline code (`)",
        bold: "Bold",
        italic: "Italic",
        quote: "Quote",
        code: "Code",
        link: "Link",
        image: "Image",
        list: "List",
        showMoreReplies: "Show more replies",
        collapseReplies: "Collapse",
        noContent: "This comment is empty",
        adminKeyLabel: "Administrator verification key",
        adminKeyPlaceholder: "Enter the administrator comment key",
        avatar: "Avatar",
    },
    footer: {
        poweredBy: "Powered by",
        rss: "RSS feed",
    },
    langNote: {
        note: "Note: ",
        description: "This page does not support English, using the default language version"
    },
    draftNote: {
        warning: "Draft Warning: ",
        description: "This article is a draft and only appears in the testing environment. It will not be displayed in the production environment."
    },
    page404: {
        title: "404 - Void Realm",
        subTitle: "It looks like you've stumbled into a code wasteland that hasn't been developed yet.",
        backToHome: "Home",
        backToPreview: "Previous Page",
        errorCode: "Error Code: 404 - Void Realm",
        notice: "Perhaps you can try:"
    },
    themeInfo: {
        light: "Switch to Light Mode",
        dark: "Switch to Dark Mode",
        system: "Switch to System Mode"
    }
}

export default translation;
