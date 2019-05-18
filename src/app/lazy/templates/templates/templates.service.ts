import {TitleCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TemplateEntity} from '../../../shared/networks/entities/template.entity';

@Injectable()
export class TemplatesService {
    private static readonly REMAP_TITLE = {
        'ai': 'Artificial Intelligence',
        'seo': 'SEO',
        'vr': 'Virtual Reality',
        'tech': 'Technology',
        'iot': 'Internet of Things',
        'private-equity': 'Private Equity',
        'content-marketing': 'Content Marketing'
    };

    public constructor(private _httpClient: HttpClient,
                       private _titleCase: TitleCasePipe) {
    }

    public getTemplates(): Observable<TemplateEntity[]> {
        return this._httpClient.get<string[]>('/assets/templates/templates.json').pipe(
            map(titles => {
                const templates: TemplateEntity[] = titles.map(id => {
                    const title = this._titleCase.transform(TemplatesService.REMAP_TITLE[id] || id);
                    return {id, title};
                });
                console.log(templates);
                return templates;
            })
        );
    }
}
