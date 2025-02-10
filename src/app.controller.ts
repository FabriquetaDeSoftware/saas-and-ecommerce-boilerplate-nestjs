import { Get, Controller, Render, Res } from '@nestjs/common';
import { IsPublicRoute } from './common/decorators/is_public_route.decorator';

@Controller()
export class AppController {
  @IsPublicRoute()
  @Get()
  @Render('index')
  public render(): void {}
}
