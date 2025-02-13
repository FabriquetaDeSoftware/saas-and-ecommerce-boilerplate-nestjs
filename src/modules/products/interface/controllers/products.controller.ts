import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Products } from '../../domain/entities/products.entity';
import { ICreateProductUseCase } from '../../domain/interfaces/use_cases/create_product.use_case.interface';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { IDeleteProductUseCase } from '../../domain/interfaces/use_cases/delete_product.use_case';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { IListManyProductUseCase } from '../../domain/interfaces/use_cases/list_many_products.use_case.interface';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  @Inject('ICreateProductUseCase')
  private readonly _createProductUseCase: ICreateProductUseCase;

  @Inject('IDeleteProductUseCase')
  private readonly _deleteProductUseCase: IDeleteProductUseCase;

  @Inject('IListManyProductUseCase')
  private readonly _listManyProductUseCase: IListManyProductUseCase;

  @Roles(RolesEnum.ADMIN)
  @Post('create')
  public async createProduct(
    @Body() input: CreateProductDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<Products> {
    const response = await this._createProductUseCase.execute(user.role, input);

    return response;
  }

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
  @Get('list-many')
  public async findMany(): Promise<Omit<Products, 'id'>[]> {
    const response = await this._listManyProductUseCase.execute();

    return response;
  }
}
