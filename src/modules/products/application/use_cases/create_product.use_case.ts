import { Inject, Injectable } from '@nestjs/common';
import { ICreateProductUseCase } from '../../domain/interfaces/use_cases/create_product.use_case.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async execute(
    role: string,
    input: CreateProductDto,
  ): Promise<Products> {
    const data = await this.intermediry(role);
    console.log(data);
    const result = await this._productsRepository.create(input);

    return result;
  }

  private async intermediry(data: string): Promise<string> {
    const dataDecoded = await this.decryptPayload(data);

    return dataDecoded;
  }

  private async decryptPayload(data: string): Promise<string> {
    const dataFromBase64ToBuffer = Buffer.from(data, 'base64');

    const dataBuffer = await this._cryptoUtil.decryptData(
      dataFromBase64ToBuffer,
    );

    const dataDecoded = dataBuffer.toString();

    return dataDecoded;
  }
}
