import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    table.string('password_hash');
    table.string('azure_id').unique();
    table.enum('role', ['employee', 'manager', 'admin']).defaultTo('employee');
    table.integer('total_points').defaultTo(0);
    table.integer('current_rank').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Chat sessions table
  await knex.schema.createTable('chat_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('topic');
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at');
    table.index(['user_id', 'started_at']);
  });

  // Chat messages table
  await knex.schema.createTable('chat_messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('chat_session_id').notNullable().references('id').inTable('chat_sessions');
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('user_message').notNullable();
    table.text('bot_response').notNullable();
    table.integer('points_awarded').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['chat_session_id', 'created_at']);
  });

  // Badges table
  await knex.schema.createTable('badges', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.string('icon_url');
    table.integer('points_required').defaultTo(0);
  });

  // User badges table
  await knex.schema.createTable('user_badges', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.uuid('badge_id').notNullable().references('id').inTable('badges');
    table.timestamp('earned_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'badge_id']);
  });

  // Points ledger table
  await knex.schema.createTable('points_ledger', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.integer('points').notNullable();
    table.string('reason').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Phishing simulations table
  await knex.schema.createTable('phishing_simulations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('email_content').notNullable();
    table.boolean('is_phishing').defaultTo(false);
    table.enum('user_response', ['clicked', 'reported', 'ignored']).nullable();
    table.boolean('correct_response').nullable();
    table.integer('points_awarded').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Training modules table
  await knex.schema.createTable('training_modules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description');
    table.text('content');
    table.integer('duration_minutes').defaultTo(0);
    table.integer('points').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // User training progress table
  await knex.schema.createTable('user_training_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.uuid('training_module_id').notNullable().references('id').inTable('training_modules');
    table.enum('status', ['not_started', 'in_progress', 'completed']).defaultTo('not_started');
    table.integer('score').defaultTo(0);
    table.timestamp('started_at');
    table.timestamp('completed_at');
    table.unique(['user_id', 'training_module_id']);
  });

  // Engagement logs table
  await knex.schema.createTable('engagement_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.string('action').notNullable();
    table.string('resource_type');
    table.uuid('resource_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('engagement_logs');
  await knex.schema.dropTableIfExists('user_training_progress');
  await knex.schema.dropTableIfExists('training_modules');
  await knex.schema.dropTableIfExists('phishing_simulations');
  await knex.schema.dropTableIfExists('points_ledger');
  await knex.schema.dropTableIfExists('user_badges');
  await knex.schema.dropTableIfExists('badges');
  await knex.schema.dropTableIfExists('chat_messages');
  await knex.schema.dropTableIfExists('chat_sessions');
  await knex.schema.dropTableIfExists('users');
}
