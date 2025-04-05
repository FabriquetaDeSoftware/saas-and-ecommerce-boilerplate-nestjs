import { Get, Controller, Render, Res } from '@nestjs/common';
import { IsPublicRoute } from './common/decorators/is_public_route.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './common/decorators/roles.decorator';
import { RolesEnum } from './shared/enum/roles.enum';
import { register } from 'prom-client';
import { FastifyReply } from 'fastify';

@ApiTags('app')
@Controller()
export class AppController {
  @IsPublicRoute()
  @Get()
  @Render('index')
  public render(): void {}

  @ApiBearerAuth()
  @Get('protected')
  public protectedRoute(): { message: string } {
    return { message: 'Protected Route' };
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.USER)
  @Get('user')
  public userRoute(): { message: string } {
    return { message: 'User Route' };
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Get('admin')
  public adminRoute(): { message: string } {
    return { message: 'Admin Route' };
  }

  @Get('metrics')
  @IsPublicRoute()
  async getMetrics(@Res() res: FastifyReply) {
    const metrics = await register.metrics();
    res.header('Content-Type', register.contentType).send(metrics);
  }
}
