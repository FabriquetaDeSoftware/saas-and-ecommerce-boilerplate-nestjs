import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
