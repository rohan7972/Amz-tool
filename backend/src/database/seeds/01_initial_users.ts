
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('users').del();

    // Inserts seed entries
    await knex('users').insert([
        {
            id: '550e8400-e29b-41d4-a716-446655440000', // Admin ID
            email: 'admin@example.com',
            password_hash: '$2b$10$TCjJXSojGL4jtRrcqRriE686eSjzikwVC', // password
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            is_active: true,
            email_verified: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);
}
