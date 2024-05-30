import { Params } from "@angular/router";
import { ActiveParamsType } from "src/app/types/active-params.type ";

export class ActiveParamsUtil {
    static processParams(params: Params): ActiveParamsType {
        const activeParams: ActiveParamsType = {types: []}; 
      
      if (params.hasOwnProperty('types')) {
        // 13:22 Модуль №13. УРОК №5
        activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']]; 
      }

      if (params.hasOwnProperty('heightTo')) {
        activeParams.heightTo = params['heightTo']; 
      }

      if (params.hasOwnProperty('heightFrom')) {
        activeParams.heightFrom = params['heightFrom']; 
      }

      if (params.hasOwnProperty('diameterTo')) {
        activeParams.diameterTo = params['diameterTo']; 
      }

      if (params.hasOwnProperty('diameterFrom')) {
        activeParams.diameterFrom = params['diameterFrom']; 
      }

      if (params.hasOwnProperty('sort')) {
        activeParams.sort = params['sort']; 
      }

      if (params.hasOwnProperty('page')) {
        activeParams.page = +params['page']; 
      }

      return activeParams;
    }
}