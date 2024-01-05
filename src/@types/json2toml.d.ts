declare module 'json2toml' {
  function json2toml(
    obj: unknown,
    options?: { newlineAfterSection: boolean },
  ): string
  export = json2toml
}
