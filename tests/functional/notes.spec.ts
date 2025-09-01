import { test } from '@japa/runner'
import { NoteFactory } from '#database/factories/note_factory'
import { DateTime } from 'luxon'
import { UserFactory } from '#database/factories/user_factory'

test.group('Note API', () => {
  test('can retrieve list of notes', async ({ client, assert }) => {
    const user = await UserFactory.create()
    await NoteFactory.merge({ userId: user.id }).createMany(3)

    const response = await client.get('/api/notes').loginAs(user)

    response.assertStatus(200)
    assert.isArray(response.body())
  })

  test('can create a new note', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const note = await NoteFactory.make()
    const response = await client.post('/api/notes').loginAs(user).json(note)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })

  test('can retrieve a note', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const note = await NoteFactory.merge({ userId: user.id }).create()

    const response = await client.get(`/api/notes/${note.id}`).loginAs(user)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().title)
    assert.isString(response.body().body)
    assert.isString(response.body().color)
    assert.isAtLeast(response.body().favorited, 0)
    assert.isAtMost(response.body().favorited, 1)
  })

  test('can update a note', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const note = await NoteFactory.merge({ userId: user.id }).create()
    const newNote = await NoteFactory.make()

    const response = await client.patch(`/api/notes/${note.id}`).loginAs(user).json(newNote)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })

  test('can delete a note', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const note = await NoteFactory.merge({ userId: user.id }).create()

    const response = await client.delete(`/api/notes/${note.id}`).loginAs(user)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })

  test('can restore a note', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const note = await NoteFactory.merge({ deletedAt: DateTime.now(), userId: user.id }).create()

    const response = await client.post(`/api/notes/restore/${note.id}`).loginAs(user)

    response.assertStatus(200)
    assert.isObject(response.body())
    assert.isString(response.body().message)
  })
})
