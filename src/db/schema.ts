import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/* ----------------- Document ----------------- */

export const documents = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    hash: text('hash').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    hashIdx: uniqueIndex('documents_hash_idx').on(table.hash),
  })
);

/* ------------- Document Version ------------- */

export const documentVersions = pgTable('document_versions', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id')
    .notNull()
    .references(() => documents.id),
  version: integer('version').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

/* ------------- Document Chunk ------------- */

export const documentChunks = pgTable('document_chunks', {
  id: serial('id').primaryKey(),
  versionId: integer('version_id')
    .notNull()
    .references(() => documentVersions.id),
  content: text('content').notNull(),
  embeddingId: text('embedding_id').notNull(), // ChromaDB ref
});
