import { init, i, id } from '@instantdb/react'

// Define the schema for our data
const schema = i.schema({
  entities: {
    // Notes entity
    notes: i.entity({
      text: i.string(),
      title: i.string().optional(),
      color: i.string(),
      createdAt: i.number(),
      tags: i.json<string[]>(),
      isPinned: i.boolean(),
    }),
    // Tags entity
    tags: i.entity({
      name: i.string(),
    }),
  },
})

// Initialize InstantDB with your app ID
const APP_ID = 'b4000325-ee7c-4fb1-a80b-aace7ab11bac'

export const db = init({ appId: APP_ID, schema })

// Export id function for creating unique IDs
export { id }

// Type helpers
export type Schema = typeof schema
export type Note = {
  id: string
  text: string
  title?: string
  color: string
  createdAt: number
  tags: string[]
  isPinned: boolean
}

export type Tag = {
  id: string
  name: string
}
