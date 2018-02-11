// Declare all JSON files valid modules, explaining their export to TS.
declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.html' {
    const value: string;
    export default value;
}

// This is provided by the Webpack defineplugin.
/*declare const process: {
    env: {
        NODE_ENV: string,
        BUILD_ID: string,
    },
};*/
