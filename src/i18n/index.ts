// Language configuration goes here.

/** Each language has a name and a function for fetching its translations at runtime. */
interface ILanguage {
    name: string;
    fetch: () => Promise<any>;
}

/** Map of supported languages. */
const languages: {[key: string]: ILanguage} = {
    'en-US': {
        name: 'English',
        fetch: () => import('./en-US.json').then(obj => Object.freeze(obj)),
    },
    'fi-FI': {
        name: 'Suomi',
        fetch: () => import('./fi-FI.json').then(obj => Object.freeze(obj)),
    },
};

export default languages;
