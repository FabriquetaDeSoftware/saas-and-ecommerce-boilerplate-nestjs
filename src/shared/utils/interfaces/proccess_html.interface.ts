export interface IProcessHTMLUtil {
  execute(
    pathHTML: string,
    variables?: Record<string, string>,
  ): Promise<string>;
}
