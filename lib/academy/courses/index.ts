import { peptidesCourse } from './peptides';
import { vitaminsCourse } from './vitamins';
import { hormonesCourse } from './hormones';
import type { Course } from '../types';

export const COURSES: Record<string, Course> = {
  peptides: peptidesCourse,
  vitamins: vitaminsCourse,
  hormones: hormonesCourse,
};

export const COURSE_IDS = ['peptides', 'vitamins', 'hormones'] as const;
export type CourseId = (typeof COURSE_IDS)[number];

export { peptidesCourse, vitaminsCourse, hormonesCourse };
