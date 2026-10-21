#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e45d419dda879f077451b844fb1bfd7de7aa997f9ad4364fbc9a737b94989bd9/contract';
import endContract from '../../snapshots/e45d419dda879f077451b844fb1bfd7de7aa997f9ad4364fbc9a737b94989bd9/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'feedbacks',
        columns: [
          col('comment', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('mentorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('submissionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'submissions',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('liveLink', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('mentorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('projectName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('repoUrl', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'submissions_status_check_56005a61',
            sql`"status" IN ('PENDING', 'APPROVED', 'REJECTED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('firstName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('STUDENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'users_role_check_689cf60f',
            sql`"role" IN ('STUDENT', 'MENTOR', 'ADMIN')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'feedbacks',
        constraint: 'feedbacks_submissionId_key',
        columns: ['submissionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'submissions',
        constraint: 'submissions_repoUrl_key',
        columns: ['repoUrl'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'feedbacks',
        index: 'feedbacks_mentorId_idx_3912a262',
        columns: ['mentorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submissions',
        index: 'submissions_mentorId_idx_3912a262',
        columns: ['mentorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submissions',
        index: 'submissions_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'feedbacks',
        foreignKey: {
          name: 'feedbacks_submissionId_fkey',
          columns: ['submissionId'],
          references: { schema: 'public', table: 'submissions', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'feedbacks',
        foreignKey: {
          name: 'feedbacks_mentorId_fkey',
          columns: ['mentorId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'submissions',
        foreignKey: {
          name: 'submissions_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'submissions',
        foreignKey: {
          name: 'submissions_mentorId_fkey',
          columns: ['mentorId'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
