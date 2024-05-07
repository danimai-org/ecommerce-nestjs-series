import {
  Body,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, PickType } from '@nestjs/swagger';
import { AbstractValidationPipe } from 'common/pipes/abstract.pipe';
import { UserParam } from 'common/decorators/user.decorator';
import { Customer } from 'common/entities/customer.entity';
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  PaginateConfig,
} from 'nestjs-paginate';
import { ValidationGroup } from './validation-group';
import { IsIDExistPipe } from 'common/pipes/IsIDExist.pipe';

export interface ControllerFactoryOptions<
  Entity extends abstract new (...args: any) => any,
> {
  entity: Entity;
  paginateConfig: PaginateConfig<InstanceType<Entity>>;
  createFields?: (keyof InstanceType<Entity>)[];
  updatedFileds?: (keyof InstanceType<Entity>)[];
}

export const ControllerFactory = <
  Entity extends abstract new (...args: any) => any,
>({
  entity,
  paginateConfig,
  createFields,
  updatedFileds,
}: ControllerFactoryOptions<Entity>): any => {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true, groups: [ValidationGroup.CREATE] },
    { body: entity as any },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true, groups: [ValidationGroup.UPDATE] },
    { body: entity as any },
  );

  class BaseController {
    service: any;

    @Get()
    @ApiPaginationQuery(paginateConfig)
    async getAll(
      @Paginate() query: PaginateQuery,
      @UserParam() user: Customer,
    ) {
      return this.service.getAll(query, user);
    }

    @Get(':id')
    @ApiOkResponse({ type: entity as any })
    async get(
      @Param('id', ParseUUIDPipe, IsIDExistPipe({ entity })) id: string,
      @UserParam() user: Customer,
    ) {
      return this.service.getOne(id, user);
    }

    @Post()
    @UsePipes(createPipe)
    @ApiBody({
      type: createFields
        ? PickType(entity as any, createFields as any)
        : entity,
    })
    @ApiOkResponse({ type: entity })
    async post(@Body() dto: Entity, @UserParam() user: Customer) {
      return this.service.create(dto, user);
    }

    @Patch(':id')
    @UsePipes(updatePipe)
    @ApiOkResponse({ type: entity })
    @ApiBody({
      type: updatedFileds
        ? PickType(entity as any, updatedFileds as any)
        : entity,
    })
    async update(
      @Param('id', ParseUUIDPipe, IsIDExistPipe({ entity })) id: string,
      @Body() dto: Entity,
      @UserParam() user: Customer,
    ) {
      return this.service.update(id, dto, user);
    }

    @Delete(':id')
    async delete(
      @Param('id', ParseUUIDPipe, IsIDExistPipe({ entity })) id: string,
      @UserParam() user: Customer,
    ) {
      await this.service.delete(id, user);
    }
  }

  return BaseController;
};
