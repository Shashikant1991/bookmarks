import {TitleCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {DocumentResponse} from '../../../shared/networks/entities/document.entity';
import {TemplateEntity, TemplateEntry} from '../../../shared/networks/entities/template.entity';

@Injectable()
export class TemplatesService {
    private static BASE_URL = '/assets/templates';

    private static readonly REMAP_TITLE = {
        'ai': 'Artificial Intelligence',
        'seo': 'SEO',
        'vr': 'Virtual Reality',
        'tech': 'Technology',
        'iot': 'Internet of Things',
        'private-equity': 'Private Equity',
        'content-marketing': 'Content Marketing'
    };

    public readonly templates$: Observable<TemplateEntity[]>;

    public constructor(private _httpClient: HttpClient,
                       private _titleCase: TitleCasePipe) {
        this.templates$ = this._httpClient.get<string[]>(`${TemplatesService.BASE_URL}/templates.json`).pipe(
            map<string[], TemplateEntity[]>(titles => titles.map(id => {
                return {id, title: this._titleCase.transform(TemplatesService.REMAP_TITLE[id] || id)};
            })),
            shareReplay()
        );
    }

    public create(template_id?: string): Observable<DocumentResponse> {
        const templateEntries = template_id ? this.getTemplateEntries(template_id) : of([]);
        return templateEntries.pipe(
            map<TemplateEntry[], DocumentResponse>(entries => {
                return {
                    id: 1,
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    archived: false,
                    label_ids: [],
                    order: 0,
                    title: template_id,
                    groups: []
                };
            })
        );
    }

    public getTemplateEntries(template_id: string): Observable<TemplateEntry[]> {
        return this._httpClient.get<TemplateEntry[]>(`${TemplatesService.BASE_URL}/${template_id}.json`);
    }
}
