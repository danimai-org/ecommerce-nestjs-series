import { faker } from '@faker-js/faker';
import { loadEntities } from 'common/entities';
import { Product } from 'common/entities/product.entity';
import { ProductVariant } from 'common/entities/product_variant.entity';
import dataSource from 'ormconfig';

async function create() {
  dataSource.setOptions({
    entities: loadEntities,
  });
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const productRepository = dataSource.getRepository(Product);
  const variantRepository = dataSource.getRepository(ProductVariant);
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array.from(Array(5).keys())) {
      const product = await queryRunner.manager.save(
        productRepository.create({
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
        }),
      );

      await queryRunner.manager.save(
        variantRepository.create({
          product_id: product.id,
          price: +faker.commerce.price({ min: 1, max: 10 }),
        }),
      );
    }
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.info('Something went wrong.');
  } finally {
    await queryRunner.release();
    console.info('Successfully seeded products');
  }
}

void create();
