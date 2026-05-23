export enum ExerciseStatus {
  Loading,
  Loaded,
  Ready,
  Answering,
  Ended,
}

export function canStart(status: ExerciseStatus): boolean {
  return status === ExerciseStatus.Loaded || status === ExerciseStatus.Ready;
}

export function canSubmitAnswer(status: ExerciseStatus): boolean {
  return status === ExerciseStatus.Answering;
}

export function shouldWarnLoading(status: ExerciseStatus): boolean {
  return status === ExerciseStatus.Loading;
}

export function shouldSkipToNext(status: ExerciseStatus): boolean {
  return status === ExerciseStatus.Ready;
}

export function shouldStartFromSubmit(status: ExerciseStatus): boolean {
  return status === ExerciseStatus.Loaded;
}

export function getStatusOnModuleLoad(validateResult: string): ExerciseStatus | 'exit' {
  return validateResult.length > 0 ? 'exit' : ExerciseStatus.Loaded;
}

export function getStatusOnStart(loaded: boolean): ExerciseStatus | null {
  if (!loaded) return null;
  return ExerciseStatus.Ready;
}

export function getStatusOnCorrectAnswer(isLastQuestion: boolean): ExerciseStatus {
  return isLastQuestion ? ExerciseStatus.Ended : ExerciseStatus.Ready;
}
