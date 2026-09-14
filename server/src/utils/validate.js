export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.errors = errors;
    throw error;
  }

  return result.data;
}
