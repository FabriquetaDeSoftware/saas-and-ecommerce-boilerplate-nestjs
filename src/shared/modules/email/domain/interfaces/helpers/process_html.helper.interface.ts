export interface IProcessHtmlHelper {
  execute(
    pathHTML: string,
    variables?: Record<string, string>,
  ): Promise<string>;
}
