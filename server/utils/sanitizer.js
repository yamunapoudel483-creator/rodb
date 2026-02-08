const sanitizeHtml = require('sanitize-html');

/**
 * Input Sanitization Utilities
 * Provides functions to clean and validate user input
 */

/**
 * Sanitize HTML content from rich text editor
 * Allows only safe HTML tags and attributes
 */
function sanitizeHTML(dirty) {
    return sanitizeHtml(dirty, {
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'strong', 'b', 'em', 'i', 'u', 's', 'strike',
            'ul', 'ol', 'li',
            'a', 'img',
            'blockquote', 'pre', 'code',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span',
        ],
        allowedAttributes: {
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height'],
            'div': ['class'],
            'span': ['class'],
            'td': ['colspan', 'rowspan'],
            'th': ['colspan', 'rowspan'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: {
            img: ['http', 'https', 'data'],
        },
        allowedClasses: {
            'div': ['article-image', 'article-caption'],
            'span': ['highlight'],
        },
        // Transform URLs to add rel="noopener noreferrer" for security
        transformTags: {
            'a': (tagName, attribs) => {
                return {
                    tagName: 'a',
                    attribs: {
                        ...attribs,
                        rel: 'noopener noreferrer',
                        target: attribs.target === '_blank' ? '_blank' : undefined,
                    },
                };
            },
        },
    });
}

/**
 * Sanitize article input data
 */
function sanitizeArticleInput(data) {
    const sanitized = {};

    // Sanitize text fields
    if (data.headline) {
        sanitized.headline = sanitizeHtml(data.headline, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.sub_headline) {
        sanitized.sub_headline = sanitizeHtml(data.sub_headline, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.summary) {
        sanitized.summary = sanitizeHtml(data.summary, { allowedTags: ['b', 'i', 'em', 'strong'], allowedAttributes: {} });
    }

    // Sanitize HTML body
    if (data.body) {
        sanitized.body = sanitizeHTML(data.body);
    }

    // Sanitize metadata
    if (data.seo_title) {
        sanitized.seo_title = sanitizeHtml(data.seo_title, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.seo_description) {
        sanitized.seo_description = sanitizeHtml(data.seo_description, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.location_tag) {
        sanitized.location_tag = sanitizeHtml(data.location_tag, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.source_attribution) {
        sanitized.source_attribution = sanitizeHtml(data.source_attribution, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.featured_image_caption) {
        sanitized.featured_image_caption = sanitizeHtml(data.featured_image_caption, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.featured_image_alt) {
        sanitized.featured_image_alt = sanitizeHtml(data.featured_image_alt, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.featured_image_credit) {
        sanitized.featured_image_credit = sanitizeHtml(data.featured_image_credit, { allowedTags: [], allowedAttributes: {} });
    }

    // Pass through safe fields
    if (data.category_id) sanitized.category_id = parseInt(data.category_id, 10);
    if (data.slug) sanitized.slug = String(data.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (data.featured_image_url) sanitized.featured_image_url = String(data.featured_image_url);
    if (data.language) sanitized.language = String(data.language);
    if (data.status) sanitized.status = String(data.status);
    if (typeof data.is_breaking === 'boolean') sanitized.is_breaking = data.is_breaking;
    if (typeof data.is_featured === 'boolean') sanitized.is_featured = data.is_featured;
    if (typeof data.is_opinion === 'boolean') sanitized.is_opinion = data.is_opinion;

    return sanitized;
}

/**
 * Sanitize news ticker input
 */
function sanitizeNewsTickerInput(data) {
    const sanitized = {};

    if (data.title) {
        sanitized.title = sanitizeHtml(data.title, { allowedTags: [], allowedAttributes: {} });
    }
    if (data.content) {
        sanitized.content = sanitizeHtml(data.content, { allowedTags: ['b', 'i', 'em', 'strong'], allowedAttributes: {} });
    }
    if (data.link_url) {
        sanitized.link_url = String(data.link_url);
    }
    if (typeof data.is_active === 'boolean') {
        sanitized.is_active = data.is_active;
    }

    return sanitized;
}

/**
 * Validate URL format
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    sanitizeHTML,
    sanitizeArticleInput,
    sanitizeNewsTickerInput,
    isValidUrl,
    isValidEmail,
};
