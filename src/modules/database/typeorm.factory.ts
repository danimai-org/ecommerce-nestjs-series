import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import ORMConfig from '../../../ormconfig';

@Injectable()
export class TypeORMConfigFactory implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return ORMConfig.options;
  }
}
