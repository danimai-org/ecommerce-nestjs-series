import { Customer } from 'common/entities/customer.entity';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';

interface ServiceFactoryOptions<T extends abstract new (...args: any) => any> {
  entity: T;
  paginateConfig: PaginateConfig<InstanceType<T>>;
}
export const ServiceFactory = <T extends abstract new (...args: any) => any>({
  paginateConfig,
}: ServiceFactoryOptions<T>) => {
  class BaseService {
    repository: Repository<InstanceType<T>>;

    async getAll(query: PaginateQuery, user?: Customer) {
      return paginate(
        {
          ...query,
          filter: {
            ...query.filter,
            customer_id: user.id,
          },
        },
        this.repository,
        paginateConfig as any,
      );
    }

    async getOne(instance: InstanceType<T>, user?: Customer) {
      return this.repository.findOneBy({
        id: instance.id,
        customer_id: user.id,
      } as any);
    }

    async create(dto: any, user?: Customer) {
      const newEntity = this.repository.create({
        ...dto,
        customer_id: user.id,
      });
      return this.repository.save(newEntity);
    }

    async update(instance: InstanceType<T>, dto: any, user?: Customer) {
      await this.repository.update(
        { id: instance.id, customer_id: user.id } as any,
        dto,
      );
      return {
        ...instance,
        ...dto,
      };
    }

    async delete(instance: InstanceType<T>, user?: Customer) {
      return this.repository.softDelete({
        id: instance.id,
        customer_id: user.id,
      } as any);
    }
  }

  return BaseService;
};
