import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Seed badges
  const badges = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Security Novice',
      description: 'Complete your first security training',
      icon_url: '/badges/novice.png',
      points_required: 100,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Phishing Expert',
      description: 'Correctly identify 10 phishing attempts',
      icon_url: '/badges/phishing-expert.png',
      points_required: 500,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Security Champion',
      description: 'Reach the top 10 on the leaderboard',
      icon_url: '/badges/champion.png',
      points_required: 2000,
    },
  ];

  await knex('badges').insert(badges);

  // Seed training modules
  const trainingModules = [
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      title: 'Introduction to Cybersecurity',
      description: 'Learn the basics of cybersecurity and common threats',
      content: 'Comprehensive introduction to cybersecurity fundamentals...',
      duration_minutes: 15,
      points: 100,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      title: 'Identifying Phishing Emails',
      description: 'Learn how to spot phishing attempts',
      content: 'Detailed guide on phishing indicators and best practices...',
      duration_minutes: 20,
      points: 150,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440103',
      title: 'Password Security',
      description: 'Best practices for creating and managing passwords',
      content: 'Guide to strong password creation and management...',
      duration_minutes: 10,
      points: 75,
    },
  ];

  await knex('training_modules').insert(trainingModules);
}
