import { relations, sql } from 'drizzle-orm'

import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const SentenceGroupsTable = sqliteTable('sentence_groups', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true
  }),
  name: text('name').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
})

export const SentenceGroupRelations = relations(
  SentenceGroupsTable,
  ({ many }) => ({
    sentences: many(SentencesTable)
  })
)

export const SentencesTable = sqliteTable('sentences', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true
  }),
  original: text('original').notNull().unique(),
  translation: text('translation').notNull(),
  grammar: text('grammar'),
  groupId: integer('group_id').default(1),
  learned: integer('learned', { mode: 'boolean' }).default(false),
  deleted: integer('deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
})

export const SentencesRelations = relations(
  SentencesTable,
  ({ one, many }) => ({
    words: many(WordsTable),
    group: one(SentenceGroupsTable, {
      fields: [SentencesTable.groupId],
      references: [SentenceGroupsTable.id]
    })
  })
)

export const WordsTable = sqliteTable(
  'words',
  {
    id: integer('id', { mode: 'number' }).primaryKey({
      autoIncrement: true
    }),
    original: text('original').notNull(),
    translation: text('translation').notNull(),
    sentenceId: integer('sentence_id'),
    deleted: integer('deleted', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
  },
  (words) => {
    return {
      originalUniqueSentence: unique().on(words.original, words.sentenceId)
    }
  }
)

export const WordsSentenceRelations = relations(WordsTable, ({ one }) => ({
  sentence: one(SentencesTable, {
    fields: [WordsTable.sentenceId],
    references: [SentencesTable.id]
  })
}))

export type SentencesReturn = typeof SentencesTable.$inferSelect
export type WordsReturn = typeof WordsTable.$inferSelect

export type SentencesRelationReturn = SentencesReturn & {
  words: WordsReturn[]
}
export type WordsRelationReturn = WordsReturn & {
  sentence: SentencesReturn
}

export type SentenceGroupsReturn = typeof SentenceGroupsTable.$inferSelect
export type SentenceGroupsRelationReturn = SentenceGroupsReturn & {
  sentences: SentencesReturn[]
}
