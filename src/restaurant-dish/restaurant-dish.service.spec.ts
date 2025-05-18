import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantDishService } from './restaurant-dish.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DishCategory, DishEntity } from '../dish/dish.entity';
import { KitchenType, RestaurantEntity } from '../restaurant/restaurant.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RestaurantDishService', () => {
  let service: RestaurantDishService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let dishRepository: Repository<DishEntity>;
  let restaurant: RestaurantEntity;
  let dishesList: DishEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantDishService],
    }).compile();

    service = module.get<RestaurantDishService>(RestaurantDishService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    dishRepository = module.get<Repository<DishEntity>>(getRepositoryToken(DishEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restaurantRepository.clear();
    await dishRepository.clear();

    dishesList = [];
    for (let i = 0; i < 5; i++) {
      const dish: DishEntity = await dishRepository.save({
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

    restaurant = await restaurantRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      kitchenType: faker.helpers.arrayElement([
        KitchenType.ITALIANA,
        KitchenType.JAPONESA,
        KitchenType.MEXICANA,
        KitchenType.COLOMBIANA,
        KitchenType.INDIA,
        KitchenType.INTERNACIONAL,
      ]),
      dishes: dishesList,
      websiteUrl: faker.internet.url(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(restaurantRepository).toBeDefined();
    expect(dishRepository).toBeDefined();
  });

  it('addDishToRestaurant should add a dish to a restaurant', async () => {
    const newDish: DishEntity = await dishRepository.save({
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

    const updatedRestaurant: RestaurantEntity = await service.addDishToRestaurant(
      restaurant.id,
      newDish.id,
    );

    expect(updatedRestaurant.dishes).not.toBeNull();
    expect(updatedRestaurant.dishes.length).toEqual(dishesList.length + 1);
    expect(updatedRestaurant.dishes[updatedRestaurant.dishes.length - 1].id).toEqual(newDish.id);
  });

  it('addDishToRestaurant should throw an exception for an invalid dish', async () => {
    await expect(() =>
      service.addDishToRestaurant(restaurant.id, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'Dish not found');
  });

  it('addDishToRestaurant should throw an exception for an invalid restaurant', async () => {
    const newDish: DishEntity = await dishRepository.save({
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

    await expect(() =>
      service.addDishToRestaurant('00000000-0000-0000-0000-000000000000', newDish.id),
    ).rejects.toHaveProperty('message', 'Restaurant not found');
  });

  it('findDishesFromRestaurant should return dishes from a restaurant', async () => {
    const dishes: DishEntity[] = await service.findDishesFromRestaurant(restaurant.id);
    expect(dishes).not.toBeNull();
    expect(dishes.length).toEqual(dishesList.length);
  });

  it('findDishesFromRestaurant should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findDishesFromRestaurant('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'Restaurant not found');
  });

  it('findDishFromRestaurant should return a dish from a restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    const storedDish: DishEntity = await service.findDishFromRestaurant(restaurant.id, dish.id);
    expect(storedDish).not.toBeNull();
    expect(storedDish.name).toEqual(dish.name);
    expect(storedDish.description).toEqual(dish.description);
    expect(storedDish.cost).toEqual(dish.cost);
    expect(storedDish.category).toEqual(dish.category);
  });

  it('findDishFromRestaurant should throw an exception for an invalid restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await expect(() =>
      service.findDishFromRestaurant('00000000-0000-0000-0000-000000000000', dish.id),
    ).rejects.toHaveProperty('message', 'Restaurant not found');
  });

  it('findDishFromRestaurant should throw an exception for an invalid dish', async () => {
    await expect(() =>
      service.findDishFromRestaurant(restaurant.id, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'Dish not found');
  });

  it('findDishFromRestaurant should throw an exception for an dish not associated to the restaurant', async () => {
    const newDish: DishEntity = await dishRepository.save({
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

    await expect(() =>
      service.findDishFromRestaurant(restaurant.id, newDish.id),
    ).rejects.toHaveProperty('message', 'Dish not found in the restaurant');
  });

  it('updateDishFromRestaurant should update a dishes list for a restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    dish.name = 'New Dish Name';
    dish.description = 'New Dish Description';
    dish.cost = 10.99;
    dish.category = DishCategory.POSTRE;

    const updatedRestaurant: RestaurantEntity = await service.updateDishesFromRestaurant(
      restaurant.id,
      [dish],
    );
    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant.dishes.length).toEqual(1);
    expect(updatedRestaurant.dishes[0].name).toEqual(dish.name);
    expect(updatedRestaurant.dishes[0].description).toEqual(dish.description);
    expect(updatedRestaurant.dishes[0].cost).toEqual(dish.cost);
    expect(updatedRestaurant.dishes[0].category).toEqual(dish.category);
  });

  it('updateDishFromRestaurant should throw an exception for an invalid restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await expect(() =>
      service.updateDishesFromRestaurant('00000000-0000-0000-0000-000000000000', [dish]),
    ).rejects.toHaveProperty('message', 'Restaurant not found');
  });

  it('updateDishFromRestaurant should throw an exception for an invalid dish', async () => {
    const dish: DishEntity = dishesList[0];
    dish.id = '00000000-0000-0000-0000-000000000000';
    await expect(() =>
      service.updateDishesFromRestaurant(restaurant.id, [dish]),
    ).rejects.toHaveProperty('message', 'Dish not found');
  });

  it('updateDishFromRestaurant should throw an exception for an dish not associated to the restaurant', async () => {
    const newDish: DishEntity = await dishRepository.save({
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

    await expect(() =>
      service.updateDishesFromRestaurant(restaurant.id, [newDish]),
    ).rejects.toHaveProperty('message', 'Dish not found in the restaurant');
  });

  it('deleteDishFromRestaurant should remove a dish from a restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await service.deleteDishFromRestaurant(restaurant.id, dish.id);
    const storedRestaurant: RestaurantEntity | null = await restaurantRepository.findOne({
      where: { id: restaurant.id },
      relations: ['dishes'],
    });
    const deletedDish: DishEntity | undefined = storedRestaurant!.dishes.find(
      (a) => a.id === dish.id,
    );
    expect(deletedDish).toBeUndefined();
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid restaurant', async () => {
    const dish: DishEntity = dishesList[0];
    await expect(() =>
      service.deleteDishFromRestaurant('00000000-0000-0000-0000-000000000000', dish.id),
    ).rejects.toHaveProperty('message', 'Restaurant not found');
  });

  it('deleteDishFromRestaurant should throw an exception for an invalid dish', async () => {
    await expect(() =>
      service.deleteDishFromRestaurant(restaurant.id, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'Dish not found');
  });

  it('deleteDishFromRestaurant should throw an exception for an dish not associated to the restaurant', async () => {
    const newDish: DishEntity = await dishRepository.save({
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

    await expect(() =>
      service.deleteDishFromRestaurant(restaurant.id, newDish.id),
    ).rejects.toHaveProperty('message', 'Dish not found in the restaurant');
  });
});
