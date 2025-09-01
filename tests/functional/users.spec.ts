import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { createReadStream } from 'node:fs'

test.group('User API', () => {
  test('can retrieve a user', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.get('api/user').loginAs(user)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().name)
    assert.isString(response.body().email)
    assert.isString(response.body().avatar)
  })

  test('can update a user', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const newUser = await UserFactory.make()

    const response = await client
      .patch('api/user/update')
      .loginAs(user)
      .json({ name: newUser.name, email: newUser.email })

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })

  test('can update a user avatar', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const file = createReadStream('./storage/test-image.png')

    const response = await client.post('api/user/update/avatar').file('file', file).loginAs(user)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })

  test('can update a user password', async ({ client, assert, cleanup }) => {
    const password = 'testing_password'
    const newPassword = 'new_testing_password'
    const user = await UserFactory.merge({ password }).create()

    const response = await client
      .patch('api/user/update/password')
      .loginAs(user)
      .json({ old_password: password, password: newPassword, password_confirmation: newPassword })

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })
})
