export default {
    'en-US': () => import('./en-US.json').then(obj => Object.freeze(obj)),
    'fi-FI': () => import('./fi-FI.json').then(obj => Object.freeze(obj)),
};
