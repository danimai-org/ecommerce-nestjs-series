import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import ORMConfig from '../../../ormconfig';
import { loadEntities } from 'common/entities';

@Injectable()
export class TypeORMConfigFactory implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...ORMConfig.options,
      entities: loadEntities,
      autoLoadEntities: true,
    };
  }
}
