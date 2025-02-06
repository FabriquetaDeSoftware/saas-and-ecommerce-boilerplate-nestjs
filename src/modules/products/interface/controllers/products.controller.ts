import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import {
  CaslAbilityFactory,
  ProductFields,
  Products,
} from 'src/common/casl/casl_ability.factory';
import { Action } from 'src/shared/enum/actions.enum';

@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  //@Roles(RolesEnum.ADMIN)
  @IsPublicRoute()
  @Post('create')
  public async createProduct(@Body() input: CreateProductDto): Promise<void> {
    const user: Auth = {
      id: 1,
      email: 'mamm',
      role: RolesEnum.USER,
      password: '123',
      created_at: new Date(),
      updated_at: new Date(),
      is_verified_account: true,
      newsletter_subscription: true,
      public_id: '123',
      terms_and_conditions_accepted: true,
    };

    const ability = this.caslAbilityFactory.createForUser(user);

    const fieldsToUpdate = Object.keys(input) as (keyof CreateProductDto)[];

    const isAllowed = fieldsToUpdate.every((field) =>
      ability.can(Action.Update, Products, field as ProductFields),
    );

    console.log(isAllowed);
    console.log(input);

    return;
  }
}
