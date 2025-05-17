import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KitchenType, RestaurantEntity } from './restaurant.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await repository.save({
        name: faker.company.name(),
        address: faker.location.secondaryAddress(),
        kitchenType: faker.helpers.arrayElement([
          KitchenType.ITALIANA,
          KitchenType.JAPONESA,
          KitchenType.MEXICANA,
          KitchenType.COLOMBIANA,
          KitchenType.INDIA,
          KitchenType.INTERNACIONAL,
        ]),
        websiteUrl: faker.internet.url(),
      });
      restaurantsList.push(restaurant);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurants: RestaurantEntity[] = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantsList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const selectedRestaurant: RestaurantEntity = restaurantsList[0];
    const restaurant: RestaurantEntity = await service.findOne(selectedRestaurant.id);
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(selectedRestaurant.name);
    expect(restaurant.address).toEqual(selectedRestaurant.address);
    expect(restaurant.kitchenType).toEqual(selectedRestaurant.kitchenType);
    expect(restaurant.websiteUrl).toEqual(selectedRestaurant.websiteUrl);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findOne('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'The restaurant with the given id was not found');
  });

  it('create should return a new restaurant', async () => {
    const newRestaurant: RestaurantEntity = await repository.save({
      name: faker.company.name(),
      address: faker.location.secondaryAddress(),
      kitchenType: faker.helpers.arrayElement([
        KitchenType.ITALIANA,
        KitchenType.JAPONESA,
        KitchenType.MEXICANA,
        KitchenType.COLOMBIANA,
        KitchenType.INDIA,
        KitchenType.INTERNACIONAL,
      ]),
      websiteUrl: faker.internet.url(),
    });

    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity | null = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant!.name).toEqual(newRestaurant.name);
    expect(storedRestaurant!.address).toEqual(newRestaurant.address);
    expect(storedRestaurant!.kitchenType).toEqual(newRestaurant.kitchenType);
    expect(storedRestaurant!.websiteUrl).toEqual(newRestaurant.websiteUrl);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    restaurant.name = faker.company.name();
    restaurant.address = faker.location.secondaryAddress();
    restaurant.kitchenType = faker.helpers.arrayElement([
      KitchenType.ITALIANA,
      KitchenType.JAPONESA,
      KitchenType.MEXICANA,
      KitchenType.COLOMBIANA,
      KitchenType.INDIA,
      KitchenType.INTERNACIONAL,
    ]);
    restaurant.websiteUrl = faker.internet.url();
    const updatedRestaurant: RestaurantEntity = await service.update(restaurant.id, restaurant);
    expect(updatedRestaurant).not.toBeNull();
    const storedRestaurant: RestaurantEntity | null = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant!.name).toEqual(restaurant.name);
    expect(storedRestaurant!.address).toEqual(restaurant.address);
    expect(storedRestaurant!.kitchenType).toEqual(restaurant.kitchenType);
    expect(storedRestaurant!.websiteUrl).toEqual(restaurant.websiteUrl);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: RestaurantEntity = restaurantsList[0];
    restaurant = {
      ...restaurant,
      name: 'New name',
      address: 'New address',
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', restaurant),
    ).rejects.toHaveProperty('message', 'The restaurant with the given id was not found');
  });

  it('update should throw an exception for invalid restaurant properties values', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    restaurant.name = faker.company.name();
    restaurant.address = faker.location.secondaryAddress();
    restaurant.kitchenType = 'chilena' as KitchenType;
    restaurant.websiteUrl = faker.internet.url();
    await expect(() => service.update(restaurant.id, restaurant)).rejects.toHaveProperty(
      'message',
      `The kitchen type must be one of the following: ${Object.values(KitchenType).join(', ')}`,
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await service.delete(restaurant.id);
    const deletedRestaurant: RestaurantEntity | null = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', 'The restaurant with the given id was not found');
  });
});
