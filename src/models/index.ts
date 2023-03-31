import dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';

import initCourseModel from './course';
import initChapterModel from './chapter';
import initUserModel from './user';
import initLessonModel from './lesson';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USER_NAME as string,
  process.env.DATABASE_USER_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT as Dialect,
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();

(async () => {
  try {
    await sequelize.sync();
    console.log('Successful synchronization with sequelize models.');
  } catch (error) {
    console.log(error);
  }
})();

const Course = initCourseModel(sequelize);
const Chapter = initChapterModel(sequelize);
const Lesson = initLessonModel(sequelize);
initUserModel(sequelize);

Course.hasMany(Chapter, {
  foreignKey: 'courseId',
});
Chapter.belongsTo(Course, {
  foreignKey: 'courseId',
});

Chapter.hasMany(Lesson, {
  foreignKey: 'chapterId',
});
Lesson.belongsTo(Chapter, {
  foreignKey: 'chapterId',
});

export default sequelize;
