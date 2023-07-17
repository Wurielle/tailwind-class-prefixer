export const pseudoClasses = [
    ":active",
    ":checked",
    ":disabled",
    ":empty",
    ":enabled",
    ":first-child",
    ":first-of-type",
    ":focus",
    ":hover",
    ":in-range",
    ":invalid",
    ":last-child",
    ":last-of-type",
    ":link",
    ":not()", // TODO: take that into account
    ":nth-child()", // TODO: take that into account
    ":nth-last-child()", // TODO: take that into account
    ":nth-last-of-type()", // TODO: take that into account
    ":nth-of-type()", // TODO: take that into account
    ":only-child",
    ":only-of-type",
    ":optional",
    ":out-of-range",
    ":read-only",
    ":read-write",
    ":required",
    ":root",
    ":target",
    ":valid",
    ":visited",
];

export const pseudoElements = [
    "::after",
    "::before",
    "::first-letter",
    "::first-line",
    "::selection",
];

export const allPseudo = [...pseudoClasses, ...pseudoElements];
