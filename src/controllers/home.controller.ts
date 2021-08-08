import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import TYPES from '../config/types';
import { HomeService } from '../services/home.service';

@controller('/')
export class HomeController {
    constructor(@inject(TYPES.HomeService) private homeService: HomeService) {
    }

    @httpGet('/')
    public get(): string {
        return 'Hellow World!!!';
    }
}
