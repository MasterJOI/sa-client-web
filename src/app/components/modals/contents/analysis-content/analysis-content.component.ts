import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule, KeyValue} from '@angular/common';
import {QuestionnaireAnalysis} from '../../../../dto/questionnaire_analysis/QuestionnaireAnalysis';
import {MessageModule} from 'primeng/message';

@Component({
  selector: 'app-analysis-content',
  standalone: true,
  imports: [CommonModule, MessageModule],
  template: `
    <div class="flex flex-col gap-2">

      <div>
        <h3 class="text-xl font-bold">Деталі автора</h3>
        <p class="text-body text-gray-700">Ідентифікатор Scopus автора: {{analysis.identifiers.SCOPUS}}</p>
        <p class="text-body text-gray-700">Ідентифікатор Orcid автора: {{analysis.identifiers.ORCID}}</p>
      </div>

      <div>
        <h3 class="text-xl font-bold">Попередження для документа</h3>
        <ul>
          <li *ngFor="let warning of analysis.adocument.warnings">
            <p-message severity="warn" [text]="warning"></p-message>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">Інформація джерел</h3>
      </div>

      <div>
        <p class="text-title text-gray-700">Знайдені джерела: {{passedWorks.length + failedWorks.length}}</p>
      </div>

      <div>
        <p class="text-title text-gray-700">Джерела, що пройшли перевірку: {{passedWorks.length}}</p>
        <ul>
          <ng-container *ngFor="let work of passedWorks; let last = last">
            <li [ngClass]="!last ? 'border-b' : ''"
                class="w-full px-4 py-2  border-gray-200">{{work}}</li>
          </ng-container>
        </ul>
      </div>

      <div>
        <p class="text-title text-gray-700">Джерела, що не пройшли перевірку: {{failedWorks.length}}</p>
        <ul>
          <ng-container *ngFor="let work of failedWorks; let last = last">
            <li [ngClass]="!last ? 'border-b' : ''" class="w-full px-4 py-2  border-gray-200">
              {{work.text}}
              <ul>
                <li *ngFor="let warning of work.warnings">
                  <p-message severity="warn" [text]="warning"></p-message>
                </li>
              </ul>
            </li>
          </ng-container>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">Результати перевірки пунктів</h3>
        <ul>
          <ng-container *ngFor="let clause of analysis.adocument.clauses | keyvalue : valueAscOrder; let last = last">
            <li [ngClass]="!last ? 'border-b' : ''" class="w-full px-4 py-2  border-gray-200">
              <span>{{'Пункт №' + clause.key}}</span>
              <span>{{clause.value.passed ? ' - пройдено' : ' - не пройдено'}}</span>

              <ul *ngIf="clause.value.warnings">
                <li *ngFor="let warning of clause.value.warnings">
                  <p-message severity="warn" [text]="warning"></p-message>
                </li>
              </ul>
            </li>
          </ng-container>
        </ul>
      </div>

    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisContentComponent implements OnInit {

  @Input()
  analysis!: QuestionnaireAnalysis;

  passedWorks: string[] = [];
  failedWorks: { text: string; warnings?: string[] }[] = [];

  constructor() {
  }

  ngOnInit() {
    const clauses = this.analysis.adocument.clauses;
    for (const clauseKey in clauses) {
      if (clauses.hasOwnProperty(clauseKey)) {
        const clause = clauses[clauseKey];

        for (const subClauseKey in clause.subClauses) {
          if (clause.subClauses.hasOwnProperty(subClauseKey)) {
            const subClause = clause.subClauses[subClauseKey];
            if (!subClause.citation) { continue; }

            if (subClause.passed) {
              this.passedWorks.push(subClause.paragraphs[0].text);
            } else {
              this.failedWorks.push({
                text: subClause.paragraphs[0].text,
                warnings: subClause.warnings,
              });
            }
          }
        }
      }
    }
  }

  valueAscOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return Number(a.key) - Number(b.key);
  }
}
