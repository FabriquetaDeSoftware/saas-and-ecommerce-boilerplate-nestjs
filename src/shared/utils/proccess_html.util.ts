import { Injectable } from '@nestjs/common';
import { IGenericExecute } from '../interfaces/generic_execute.interface';
import * as fs from 'node:fs/promises';
import { HtmlProcessParams } from './interfaces/proccess_html.interface';

@Injectable()
export class ProccessHtmlUtil
  implements IGenericExecute<HtmlProcessParams, string>
{
  public async execute(params: HtmlProcessParams): Promise<string> {
    const { pathHTML, variables } = params;

    const htmlContent = await fs.readFile(pathHTML, 'utf-8');

    if (!variables) {
      return htmlContent;
    }

    const processedHtml = this.replacePlaceholders(htmlContent, variables);

    console.log(processedHtml);
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
/*    
  const placeholders = { NAME: 'João Silva', LINK: 'https://example.com' };

  await this._proccessHtmlUtil.execute({
    pathHTML:
      '/home/api/nestjs/auth-boilerplate/src/shared/modules/email/templates/pt_br/WELCOME.html',
    variables: placeholders,
  });
*/
