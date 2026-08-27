import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    WITH ranked_sessions AS (
      SELECT
        id,
        first_value(id) OVER (PARTITION BY user_id ORDER BY started_at, id) AS retained_id
      FROM chat_sessions
    )
    UPDATE chat_messages
    SET chat_session_id = ranked_sessions.retained_id
    FROM ranked_sessions
    WHERE chat_messages.chat_session_id = ranked_sessions.id
      AND ranked_sessions.id <> ranked_sessions.retained_id
  `);

  await knex.raw(`
    WITH ranked_sessions AS (
      SELECT
        id,
        first_value(id) OVER (PARTITION BY user_id ORDER BY started_at, id) AS retained_id
      FROM chat_sessions
    )
    DELETE FROM chat_sessions
    WHERE id IN (
      SELECT id
      FROM ranked_sessions
      WHERE id <> retained_id
    )
  `);

  await knex.schema.alterTable('chat_sessions', (table) => {
    table.unique(['user_id'], 'chat_sessions_one_per_user');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_sessions', (table) => {
    table.dropUnique(['user_id'], 'chat_sessions_one_per_user');
  });
}
