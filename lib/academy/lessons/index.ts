/**
 * RE GEN Academy — Lesson Content Index
 * Exports all lesson data for use in course modules
 */

export { peptideLessons } from './peptides';
export { vitaminLessons } from './vitamins';
export { hormoneLessons } from './hormones';

import { peptideLessons } from './peptides';
import { vitaminLessons } from './vitamins';
import { hormoneLessons } from './hormones';
import type { Lesson } from '../types';

/**
 * Combined lesson lookup by module ID
 * Keys are module IDs (p1-p9, v1-v7, h1-h6)
 */
export const allLessons: Record<string, Lesson> = {
  ...peptideLessons,
  ...vitaminLessons,
  ...hormoneLessons,
};

/**
 * Get lesson content for a module by its ID
 */
export function getLessonForModule(moduleId: string): Lesson | undefined {
  return allLessons[moduleId];
}
