/** Semantic unit of duration. */
export type Milliseconds = number;

/** The separator of params when serializing. */
export const PARAMS_SEP = ',';

/** Return an array of `length` filled with `0`. */
export function empty_array(length: number): (0)[] {
  return new Array(length).fill(0);
}

export function bool_to_string(value: boolean): 'true' | 'false' {
  return value ? 'true' : 'false';
}

export function string_to_bool(value: string): boolean {
  return value === 'true';
}

/** Basic getter for `localStorage`.
 * @returns the value of `key` in `localStorage`. If null, return `defaultValue`.
 */
export function storage_get(key: string, defaultValue: string): string {
  return localStorage.getItem(key) ?? defaultValue;
}

/** Basic setter for `localStorage`. */
export function storage_set(key: string, value: string) {
  localStorage.setItem(key, value);
}

/** Split array into chunks of `chunkSize`. */
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize)
    result.push(arr.slice(i, i + chunkSize));
  return result;
}

/** Generate a random uppercase print ID of given length (default 3). */
export function generatePrintId(length = 3): string {
  return Array.from({ length }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
}

/** Format questions as numbered problem strings with blank placeholders. */
export function formatProblems(questions: { problem: string }[], blankStr = "__________"): string[] {
  return questions.map((q, index) => {
    const base = `(${index + 1}) ${q.problem}`;
    return q.problem.includes('?') ? base.replace("?", blankStr) : base + blankStr;
  });
}

/** Format questions as numbered answer strings. */
export function formatAnswers(questions: { correctAnswer: string }[]): string[] {
  return questions.map((q, index) => `(${index + 1}) ${q.correctAnswer}`);
}

/** Extract param values from FormData (keys starting with "param-"). */
export function extractParamsFromFormData(formData: FormData, paramCount: number): string[] {
  const params: string[] = new Array(paramCount);
  formData.forEach((value, key) => {
    if (key.startsWith("param-"))
      params[parseInt(key.substring("param-".length))] = value as string;
  });
  return params;
}

/** Build an exercise URL path from category id, params array, and quantity. */
export function buildExerciseUrl(categoryId: string, params: string[], quantity: number): string {
  return `/exercise/${categoryId}/${params.join(',')}/${quantity}`;
}

/** Validate a string as a positive integer. Returns the number or null. */
export function validatePositiveInteger(raw: string): number | null {
  if (/^\d+$/.test(raw)) {
    const val = parseInt(raw);
    if (val >= 1) return val;
  }
  return null;
}
