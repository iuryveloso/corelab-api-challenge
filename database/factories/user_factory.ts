import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      avatar: `${faker.string.uuid()}.png`,
      password: faker.string.sample({ min: 6, max: 10 }),
    }
  })
  .build()
