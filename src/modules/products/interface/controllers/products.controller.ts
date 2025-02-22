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
import { IDeleteProductUseCase } from '../../domain/interfaces/use_cases/delete_product.use_case';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { ListManyProductsDto } from '../../application/dto/list_many_products.dto';
import { ListManyProductsWithoutIdReturn } from '../../domain/types/list_many_products_return.type';
import { IUpdateProductInfoUseCase } from '../../domain/interfaces/use_cases/update_product_info.use_case.interface';
import { UpadateProductInfoDto } from '../../application/dto/update_product_info.dto';
import { TypeProductEnum } from '../../application/enum/type_product.enum';
import { IProductsOrchestrator } from '../../domain/interfaces/orchestrators/products.orchestrator.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Inject('IProductsOrchestrator')
  private readonly _productsOrchestrator: IProductsOrchestrator;

  @Inject('IDeleteProductUseCase')
  private readonly _deleteProductUseCase: IDeleteProductUseCase;

  @Inject('IUpdateProductInfoUseCase')
  private readonly _updateProductInfoUseCase: IUpdateProductInfoUseCase;

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Post('create/:type')
  public async createProduct(
    @Body() input: CreateProductDto,
    @Param('type', new ParseEnumPipe(TypeProductEnum)) type: TypeProductEnum,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<Products> {
    const response = await this._productsOrchestrator.create(
      user.role,
      input,
      type,
    );

    return response;
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Patch('update/:publicId')
  public async updateProduct(
    @Body() body: UpadateProductInfoDto,
  ): Promise<Products> {
    const response = await this._updateProductInfoUseCase.execute(body);

    return response;
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @Delete('delete/:publicId')
  @HttpCode(204)
  public async DeleteProductUseCase(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IJwtUserPayload,
  ) {
    const response = await this._deleteProductUseCase.execute(
      user.role,
      publicId,
    );

    return response;
  }

  @IsPublicRoute()
  @Get('list-many/:type')
  public async findMany(
    @Param('type', new ParseEnumPipe(TypeProductEnum)) type: TypeProductEnum,
    @Query() query: ListManyProductsDto,
  ): Promise<ListManyProductsWithoutIdReturn> {
    const response = await this._productsOrchestrator.listMany(query, type);

    return response;
  }
}
