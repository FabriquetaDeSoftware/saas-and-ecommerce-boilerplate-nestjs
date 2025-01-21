import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { IProcessHTMLUtil } from './interfaces/proccess_html.interface';

@Injectable()
export class ProccessHtmlUtil implements IProcessHTMLUtil {
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
