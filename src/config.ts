export function getApiKey(): string {
  const key = process.env.CAPSOLVER_API_KEY;
  if (!key) {
    throw new Error(
      "CAPSOLVER_API_KEY is not set. Set it in .env or export it.",
    );
  }
  return key;
}
