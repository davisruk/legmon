import {
  RouterReducerState,
  RouterStateSerializer,
  routerReducer
} from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';
import { ActionReducerMap } from '@ngrx/store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class RouterCustomSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;
    return { url, params, queryParams };
  }
}
