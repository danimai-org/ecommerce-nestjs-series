import { loadEntities } from 'common/entities';
import { User } from 'common/entities/user.entity';
import dataSource from 'ormconfig';

async function create() {
  dataSource.setOptions({
    entities: loadEntities,
  });
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const userRepository = dataSource.getRepository(User);

  try {
    const admin = userRepository.create({
      name: 'Admin',
      is_active: true,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    await admin.save();
    console.log('Admin created successfully.');
  } catch (error) {
    console.log(error.message);
  }
  process.stdout;
}

void create();
