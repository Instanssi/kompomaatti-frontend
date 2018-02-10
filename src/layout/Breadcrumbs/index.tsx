import Vue from 'vue';
import Component from 'vue-class-component';
// import { RouteRecord } from 'vue-router/types/router';

// import globalState from 'src/state';


/*interface IRouteInfo {
    title: string;
    name: string | null;
    params: any;
}*/

@Component
export default class Breadcrumbs extends Vue {
    lastMatch = [] as any[];
    lastParams = {} as any;

    /*

    protected disposeRouterHook: any = null;

    mounted() {
        this.disposeRouterHook = this.$router.afterEach((to, from) => {
            this.updateRoute(to.matched, this.$route.params);
        });
        this.updateRoute(this.$route.matched, this.$route.params);
    }

    beforeDestroy() {
        this.disposeRouterHook!();
    }

    updateRoute(matched: RouteRecord[], params): void {
        // console.info('updateRoute', matched.map(m => m.path), params);
        this.lastParams = params;
        this.lastMatch.length = 0;
        this.lastMatch.push(...matched);
    }

    getRouteInfo(route: RouteRecord): IRouteInfo | null {
        const instance = route.instances.default as any;
        if (!instance) {
            return null;
        }
        const viewTitle = instance.viewTitle;

        const handleTitle = (title: any | string | undefined) => {
            if (title && typeof title === 'object') {
                return globalState.translate(title.key, title.values);
            }
            return title;
        };

        return viewTitle ? {
            // FIXME: This will translate non-translation keys
            // Add a different computed value for translations and titles?
            title: handleTitle(viewTitle),
            name: (route.meta && route.meta.routeName) || route.name || null,
            params: this.lastParams,
        } : null;
    }

    get routeItems(): IRouteInfo[] {
        return this.lastMatch
            .map(record => this.getRouteInfo(record))
            // silly ts, this removes the nulls (items with no route title)
            .filter(r => r) as any as IRouteInfo[];
    }
    */
    render(h) {
        return null;
        /*
        // const { routeItems } = this;
        return (
            <ol class="breadcrumb">
                {routeItems.map(item => (
                    <li>
                        <router-link to={item}>{item.title}</router-link>
                    </li>
                ))}
            </ol>
        );*/
    }
}
