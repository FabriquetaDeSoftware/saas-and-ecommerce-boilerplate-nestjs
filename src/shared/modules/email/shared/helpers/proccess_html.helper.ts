import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { IProcessHtmlHelper } from '../../domain/interfaces/helpers/proccess_html.helper.interface';

@Injectable()
export class ProcessHtmlHelper implements IProcessHtmlHelper {
  public async execute(
    pathHTML: string,
    variables?: Record<string, string>,
  ): Promise<string> {
    const htmlContent = await fs.readFile(pathHTML, 'utf-8');

    if (!variables) {
      return htmlContent;
    }

    const processedHtml = this.replacePlaceholders(htmlContent, variables);

    return processedHtml;
  }

  private replacePlaceholders(
    html: string,
    variables: Record<string, string>,
  ): string {
    let resultHtml = html;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `%{{${key}}}%`;
      resultHtml = resultHtml.replace(new RegExp(placeholder, 'g'), value);
    }

    return resultHtml;
  }
}
