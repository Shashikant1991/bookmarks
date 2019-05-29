import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BookComponent} from './book/book.component';
import {ChapterNavComponent} from './chapter-nav/chapter-nav.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {TocComponent} from './toc/toc.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        FontAwesomeModule
    ],
    declarations: [
        BookComponent,
        ChapterNavComponent,
        MarkdownComponent,
        TocComponent
    ],
    exports: [
        BookComponent,
        ChapterNavComponent,
        MarkdownComponent,
        TocComponent
    ]
})
export class MarkdownModule {
}
