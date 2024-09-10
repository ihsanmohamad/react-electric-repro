import { bigint, boolean, pgTable, varchar, serial, pgEnum, text, primaryKey, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { generateId } from 'lucia';

const timestampField = {
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
		.notNull()
		.$defaultFn(() => new Date())
};

const durationField = {
	startAt: timestamp('start_at', { mode: 'date', withTimezone: true })
		.notNull(),
	endAt: timestamp('end_at', { mode: 'date', withTimezone: true })
		.notNull()
};

export const subscriptionPlanEnum = pgEnum('plan', [
	'free',
	'premium',
	'custom',
]);

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

const user = pgTable('user', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	email: varchar('email', { length: 255 }).unique().notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	...timestampField,
});

const userRelations = relations(user, ({ many, one }) => ({
	usersToRoles: many(usersToRoles),
	usersToPassword: one(password, {
		fields: [user.id],
		references: [password.userId]
	}),
	event: many(event)
	// usersToOauth: one(oauthAccount, {
	// 	fields: [user.id],
	// 	references: [oauthAccount.userId]
	// }),
}))


const password = pgTable('password', {
	id: serial('id').primaryKey(),
	hashedPassword: text('hashed_password').notNull(),
	userId: varchar('user_id', { length: 255 }).references(() => user.id),
	...timestampField,
})

const passwordRelations = relations(password, ({one}) => ({
	passwordToUser: one(user),
}))

const userProfile = pgTable('user_profile', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),
	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	plan: subscriptionPlanEnum('plan').default("free"),
	picture: varchar('picture', { length: 1024 }),
	...timestampField,
});

const organizerProfile = pgTable('organizer_profile', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),
	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	plan: subscriptionPlanEnum('plan').default("free"),
	picture: varchar('picture', { length: 1024 }),
	...timestampField,
});

const userRole = pgTable('user_role', {
	id: serial('id').primaryKey(),
	name: text('name').unique(),
	...timestampField,
});

const userRoleRelations = relations(userRole, ({ many }) => ({
	usersToRoles: many(usersToRoles)
}))

const usersToRoles = pgTable('users_to_roles', {
	userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id),
	roleId: serial('role_id').notNull().references(() => userRole.id),
}, (t) => ({
	pk: primaryKey({columns: [t.userId, t.roleId]}),
}),
);

const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
	role: one(userRole, {
		fields: [usersToRoles.roleId],
		references: [userRole.id],
	}),
	user: one(user, {
		fields: [usersToRoles.userId],
		references: [user.id],
	}),
}));

const emailVerification = pgTable('email_verification', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull(),
	...timestampField,

});

const passwordResetToken = pgTable('password_reset_token', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'bigint' }).notNull(),
	...timestampField,

});

const userSession = pgTable('user_session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {mode: 'date', withTimezone: true}).notNull(),
	...timestampField,

});

const oauthAccount = pgTable('oauth_account', {
	providerId: text('provider_id').notNull(),
	providerUserId: text('provider_user_id').notNull(),
	userId: varchar('user_id', { length: 255 }).references(() => user.id),
},  (table) => {
	return {
	  pk: primaryKey({columns: [table.providerId, table.providerUserId]}),
	  fk: foreignKey({
		columns: [table.providerId, table.providerUserId],
		foreignColumns: [table.providerId, table.providerUserId],
	  })
	};
});

const event = pgTable('event', {
	id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	userId: varchar('user_id', { length: 255 })
		.notNull().references(() => user.id),
	type: text('type').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default("draft"),
	access_type: accessTypeEnum('access_type').default("public"),
	...durationField,
	...timestampField
})

export const eventRelations = relations(event, ({ one, many }) => ({
	user: one(user, {
	  fields: [event.userId],
	  references: [user.id],
	}),
	gallery: many(gallery)
  }));

const gallery = pgTable('gallery', {
	id: varchar('id', { length: 255 }).primaryKey(),
	// id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => generateId(15)),
	// eventId: varchar('event_id', { length: 255 })
	// 	.notNull()
	// 	.references(() => event.id),
	ext: text('ext').notNull().$default(() => 'other'),
	eventId: varchar('event_id', { length: 255 })
	.notNull().references(() => event.id),
	type: text('type').notNull().$default(() => 'Other'),
	access_type: accessTypeEnum('access_type').default("public"),
	trashedAt: timestamp('trashed_at', { mode: 'date', withTimezone: true }),
	...timestampField
})

export const galleryRelations = relations(gallery, ({ one, many }) => ({
	event: one(event, {
	  fields: [gallery.eventId],
	  references: [event.id],
	}),
  }));


export { 
	emailVerification, passwordResetToken, user, 
	userProfile, organizerProfile, userSession, userRole, userRoleRelations, userRelations,
	usersToRolesRelations, usersToRoles, password, passwordRelations, oauthAccount,
	event, gallery
};
