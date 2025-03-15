import { Get, Controller, Render } from '@nestjs/common';
import { IsPublicRoute } from './common/decorators/is_public_route.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './common/decorators/roles.decorator';
import { RolesEnum } from './shared/enum/roles.enum';

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
  @Roles(RolesEnum.ADMIN)
  @Get('admin')
  public adminRoute(): { message: string } {
    return { message: 'Admin Route' };
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.USER)
  @Get('user')
  public userRoute(): { message: string } {
    return { message: 'User Route' };
  }
}
