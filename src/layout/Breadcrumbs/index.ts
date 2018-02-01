import Vue from 'vue';
import { RouteRecord } from 'vue-router/types/router';
import _get from 'lodash/get';

import globalState from 'src/state';
import template from './breadcrumbs.html';


interface IRouteInfo {
    title: string;
    name: string | null;
    params: any;
}

export default Vue.extend({
    template,
    data: () => ({
        lastMatch: [] as any[],
        lastParams: {} as any,
        _disposeRouterHook: null as (Function | null),
    }),
    mounted() {
        this._disposeRouterHook = this.$router.afterEach((to, from) => {
            this.updateRoute(to.matched, this.$route.params);
        });
        this.updateRoute(this.$route.matched, this.$route.params);
    },
    beforeDestroy() {
        this._disposeRouterHook!();
    },
    methods: {
        updateRoute(matched: RouteRecord[], params): void {
            console.info('updateRoute', matched.map(m => m.path), params);
            this.lastParams = params;
            this.lastMatch.length = 0;
            this.lastMatch.push(...matched);
        },
        getRouteInfo(route: RouteRecord): IRouteInfo | null {
            const instance = route.instances.default;
            const viewTitle = (instance as any).viewTitle as string;
            return viewTitle ? {
                // FIXME: This will translate non-translation keys
                title: viewTitle && globalState.translate(viewTitle) || '',
                name: route.name || null,
                params: this.lastParams,
            } : null;
        }
    },
    computed: {
        routeItems(): (IRouteInfo | null)[] {
            return this.lastMatch
                .map(record => this.getRouteInfo(record))
                .filter(r => r);
        },
    },
});
