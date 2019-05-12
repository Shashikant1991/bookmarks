import {Pipe, PipeTransform} from '@angular/core';

const HTTP_PROTOCOL = /^https?:\/\//i;

@Pipe({name: 'shortenUrl', pure: true})
export class ShortenUrlPipe implements PipeTransform {
    public transform(value: string | any): any {
        if (typeof value === 'string' && HTTP_PROTOCOL.test(value)) {
            value = value.replace(HTTP_PROTOCOL, '');
            // remove trailing slash if it's the only slash
            if (value.indexOf('/') === value.length - 1) {
                value = value.substring(0, value.length - 1);
            }
            return value;
        }
        return value;
    }
}
