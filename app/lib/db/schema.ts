import { pgTable, text, pgEnum, varchar} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', [
	'draft',
	'paused',
	'published',
	'completed'
]);

export const accessTypeEnum = pgEnum('access_type', [
	'public',
	'private'
]);

const event = pgTable('event', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
	
	type: text('type').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default("draft"),
	access_type: accessTypeEnum('access_type').default("public"),
})
export { 
	event
};
