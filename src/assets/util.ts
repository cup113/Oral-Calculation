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
