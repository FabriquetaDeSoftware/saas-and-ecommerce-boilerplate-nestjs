import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Products } from '../../domain/entities/products.entity';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { ListManyProductsDto } from '../../application/dto/list_many_products.dto';
import { ListManyProductsReturn } from '../../domain/interfaces/returns/list_many_products_return.type';
import { UpdateProductInfoDto } from '../../application/dto/update_product_info.dto';
import { IProductsOrchestrator } from '../../domain/interfaces/orchestrators/products.orchestrator.interface';
import {
  TypeAndIdProductParamsDto,
  TypeProductParamsDto,
} from '../../application/dto/params_to_product_routes.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Inject('IProductsOrchestrator')
  private readonly _productsOrchestrator: IProductsOrchestrator;

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Post('create/:type')
  public async createProduct(
    @Body() input: CreateProductDto,
    @Param() type: TypeProductParamsDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<Products> {
    const response = await this._productsOrchestrator.create(
      user.role,
      input,
      type.type,
    );

    return response;
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Patch('update/:type/:public_id')
  public async updateProduct(
    @Param() params: TypeAndIdProductParamsDto,
    @Body() body: UpdateProductInfoDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<Products> {
    const response = await this._productsOrchestrator.update(
      user.role,
      params,
      body,
    );

    return response;
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Delete('delete/:type/:public_id')
  @HttpCode(204)
  public async DeleteProductUseCase(
    @Param() params: TypeAndIdProductParamsDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<void> {
    await this._productsOrchestrator.delete(user.role, params);

    return;
  }

  @IsPublicRoute()
  @Get('list-many/:type')
  public async findMany(
    @Param() type: TypeProductParamsDto,
    @Query() query: ListManyProductsDto,
  ): Promise<ListManyProductsReturn> {
    const response = await this._productsOrchestrator.listMany(
      query,
      type.type,
    );

    return response;
  }
}
