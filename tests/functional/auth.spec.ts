import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth API', () => {
  test('can login', async ({ client, assert }) => {
    const password = 'testing_password'
    const user = await UserFactory.merge({ password }).create()

    const response = await client.post('api/login').json({ email: user.email, password })
    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().token)
  })

  test('can register', async ({ client, assert }) => {
    const password = 'testing_password'
    const user = await UserFactory.merge({ password }).make()

    const response = await client
      .post('api/register')
      .json({ name: user.name, email: user.email, password, password_confirmation: password })
    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().token)
  })

  test('can logout', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client.post('api/logout').loginAs(user)
    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })
})
