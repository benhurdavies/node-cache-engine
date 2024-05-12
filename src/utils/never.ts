export function assertUnreachable(errorMessage: string, value: never): never {
  throw new Error(`${errorMessage} [Value as string: "${String(value)}"]`);
}
