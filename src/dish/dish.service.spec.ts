import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { DishCategory, DishEntity } from './dish.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('DishService', () => {
  let service: DishService;
  let repository: Repository<DishEntity>;
  let dishesList: DishEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DishService],
    }).compile();

    service = module.get<DishService>(DishService);
    repository = module.get<Repository<DishEntity>>(getRepositoryToken(DishEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    dishesList = [];
    for (let i = 0; i < 5; i++) {
      const dish: DishEntity = await repository.save({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        cost: parseFloat(faker.commerce.price()),
        category: faker.helpers.arrayElement([
          DishCategory.ENTRADA,
          DishCategory.PLATO_FUERTE,
          DishCategory.POSTRE,
          DishCategory.BEBIDA,
        ]),
      });
      dishesList.push(dish);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('findAll should return all dishes', async () => {
    const dishes: DishEntity[] = await service.findAll();
    expect(dishes).not.toBeNull();
    expect(dishes).toHaveLength(dishesList.length);
  });

  it('findOne should return a dish by id', async () => {
    const selectedDish: DishEntity = dishesList[0];
    const dish: DishEntity = await service.findOne(selectedDish.id);
    expect(dish).not.toBeNull();
    expect(dish.name).toEqual(selectedDish.name);
    expect(dish.description).toEqual(selectedDish.description);
    expect(dish.cost).toEqual(selectedDish.cost);
    expect(dish.category).toEqual(selectedDish.category);
  });

  it('findOne should throw an exception for an invalid dish', async () => {
    await expect(() =>
      service.findOne('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'The dish with the given id was not found');
  });

  it('create should return a new dish', async () => {
    const newDish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost: parseFloat(faker.commerce.price()),
      category: faker.helpers.arrayElement([
        DishCategory.ENTRADA,
        DishCategory.PLATO_FUERTE,
        DishCategory.POSTRE,
        DishCategory.BEBIDA,
      ]),
      restaurants: [],
    };
    const createdDish: DishEntity = await service.create(newDish);
    expect(createdDish).not.toBeNull();
    const storedDish: DishEntity | null = await repository.findOne({
      where: { id: createdDish.id },
    });
    expect(storedDish).not.toBeNull();
    expect(storedDish!.name).toEqual(createdDish.name);
    expect(storedDish!.description).toEqual(createdDish.description);
    expect(storedDish!.cost).toEqual(createdDish.cost);
    expect(storedDish!.category).toEqual(createdDish.category);
  });

  it('create should throw an exception for a dish with invalid category value', async () => {
    const newDish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost: parseFloat(faker.commerce.price()),
      category: 'sopas' as DishCategory,
      restaurants: [],
    };
    await expect(() => service.create(newDish)).rejects.toHaveProperty(
      'message',
      `The category must be one of the following: ${Object.values(DishCategory).join(', ')}`,
    );
  });

  it('create should throw an exception for a dish with invalid cost value', async () => {
    const newDish: DishEntity = {
      id: '',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      cost: -100,
      category: faker.helpers.arrayElement([
        DishCategory.ENTRADA,
        DishCategory.PLATO_FUERTE,
        DishCategory.POSTRE,
        DishCategory.BEBIDA,
      ]),
      restaurants: [],
    };
    await expect(() => service.create(newDish)).rejects.toHaveProperty(
      'message',
      'The cost must be a positive number',
    );
  });

  it('update should modify a dish', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = faker.commerce.productName();
    dish.description = faker.commerce.productDescription();
    dish.cost = parseFloat(faker.commerce.price());
    dish.category = faker.helpers.arrayElement([
      DishCategory.ENTRADA,
      DishCategory.PLATO_FUERTE,
      DishCategory.POSTRE,
      DishCategory.BEBIDA,
    ]);
    const updatedDish: DishEntity = await service.update(dish.id, dish);
    expect(updatedDish).not.toBeNull();
    const storedDish: DishEntity | null = await repository.findOne({
      where: { id: dish.id },
    });
    expect(storedDish).not.toBeNull();
    expect(storedDish!.name).toEqual(dish.name);
    expect(storedDish!.description).toEqual(dish.description);
    expect(storedDish!.cost).toEqual(dish.cost);
    expect(storedDish!.category).toEqual(dish.category);
  });

  it('update should throw an exception for an invalid dish', async () => {
    let dish: DishEntity = dishesList[0];
    dish = {
      ...dish,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', dish),
    ).rejects.toHaveProperty('message', 'The dish with the given id was not found');
  });

  it('update should throw an exception for a dish with invalid category value', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = faker.commerce.productName();
    dish.description = faker.commerce.productDescription();
    dish.cost = parseFloat(faker.commerce.price());
    dish.category = 'sopas' as DishCategory;

    await expect(() => service.update(dish.id, dish)).rejects.toHaveProperty(
      'message',
      `The category must be one of the following: ${Object.values(DishCategory).join(', ')}`,
    );
  });

  it('update should throw an exception for a dish with invalid cost value', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = faker.commerce.productName();
    dish.description = faker.commerce.productDescription();
    dish.cost = parseFloat(faker.commerce.price());
    dish.category = faker.helpers.arrayElement([
      DishCategory.ENTRADA,
      DishCategory.PLATO_FUERTE,
      DishCategory.POSTRE,
      DishCategory.BEBIDA,
    ]);
    dish.cost = -100;

    await expect(() => service.update(dish.id, dish)).rejects.toHaveProperty(
      'message',
      'The cost must be a positive number',
    );
  });

  it('delete should remove a dish', async () => {
    const dish: DishEntity = dishesList[0];
    await service.delete(dish.id);
    const deletedDish: DishEntity | null = await repository.findOne({
      where: { id: dish.id },
    });
    expect(deletedDish).toBeNull();
  });

  it('delete should throw an exception for an invalid dish', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'The dish with the given id was not found');
  });
});
