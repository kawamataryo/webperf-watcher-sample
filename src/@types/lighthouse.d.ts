export interface AuditsResult {
  id: string;
  title: string;
  description: string;
  score: number;
  scoreDisplayMode: string;
  numericValue: number;
  numericUnit: string;
  displayValue: string;
  details?: Details;
}

export interface Details {
  type: string;
  items: Item[];
}

export interface Item {
  finalLayoutShiftTraceEventFound: boolean;
}
