interface Publisher {
  "prism:issn"?: string | null;
  "prism:eIssn"?: string | null;
  "prism:publicationName"?: string | null;
}

interface ScopusWork {
  title: string;
  doi: string;
  eid: string;
  isbn: string[];
  date: string;
  publisher: Publisher;
}

interface DocumentParagraph {
  lineNumber: number;
  text: string;
}

interface DocumentClause {
  subClauses: DocumentSubClause[];
  clauseNumber: number;
  warnings: string[];
  passed: boolean;
  citation: boolean;
}

interface DocumentSubClause {
  clauseNumber: number;
  paragraphs: DocumentParagraph[];
  warnings: string[];
  passed: boolean;
  citation: boolean;
}

interface Document {
  paragraphs: DocumentParagraph[];
  clauses: Record<number, DocumentClause>;
  warnings: string[];
  passed: boolean;
  justification: string[];
}

interface Identifier {
  ORCID?: string;
  SCOPUS?: string;
}

export interface QuestionnaireAnalysis {
  identifiers: Identifier;
  scopusWorks: ScopusWork[];
  position: string;
  adocument: Document;
  qualification: string;
  experienceInYears: number;
}
