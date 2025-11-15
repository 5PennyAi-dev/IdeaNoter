import { init, i } from '@instantdb/react'

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
      isFavorite: i.boolean(),
      folderId: i.string().optional(),
    }),
    // Tags entity
    tags: i.entity({
      name: i.string(),
    }),
    // Folders entity
    folders: i.entity({
      name: i.string(),
      color: i.string().optional(),
      createdAt: i.number(),
    }),
  },
})

// Initialize InstantDB with your app ID
const APP_ID = 'b4000325-ee7c-4fb1-a80b-aace7ab11bac'

export const db = init({ appId: APP_ID, schema })

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
  isFavorite: boolean
  folderId?: string
}

export type Tag = {
  id: string
  name: string
}

export type Folder = {
  id: string
  name: string
  color?: string
  createdAt: number
}
