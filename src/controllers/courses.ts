import { Request, Response } from 'express';
import sequelize from '../models';

const { Course, Chapter, Lesson } = sequelize.models;

interface ChapterWithLessons {
  id: number;
  title: string;
  position: string;
  lessons: {
    id: number;
    position: string;
    title: string;
  }[];
}

const coursesController = {
  async getAllCourses(req: Request, res: Response) {
    const courseArray = await Course.findAll();

    res.send(courseArray);
  },
  async getCourse(req: Request, res: Response) {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    const courseChapters = await Chapter.findAll({
      where: {
        courseId: id,
      },
      order: [
        ['id', 'ASC'],
      ]
    });

    const lessonIds: number[] = [];
    const chaptersWithLessons: ChapterWithLessons[] = [];

    for (const { dataValues: chapterData } of courseChapters) {
      const chapterWithLessons: ChapterWithLessons = {
        id: chapterData.id,
        title: chapterData.title,
        position: String(chapterData.position),
        lessons: [],
      };

      const chapterLessons = await Lesson.findAll({
        where: {
          chapterId: chapterData.id,
        },
        order: [
          ['id', 'ASC'],
      ],
      });

      for (const { dataValues: lessonData } of chapterLessons) {
        chapterWithLessons.lessons.push({
          id: lessonData.id,
          position: `${chapterData.position}.${lessonData.position}`,
          title: lessonData.title,
        });

        lessonIds.push(lessonData.id);
      }

      chaptersWithLessons.push(chapterWithLessons);
    }

    const responseData = {
      id: course?.dataValues.id,
      title: course?.dataValues.title,
      audience: course?.dataValues.audience,
      lessonIds,
      chaptersWithLessons,
    };

    res.send(responseData);
  },
};

export default coursesController;
