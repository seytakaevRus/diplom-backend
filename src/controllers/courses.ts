import { Request, Response } from 'express';

import sequelize from '../models';
import { getChaptersWithLessons } from '../utils/getChaptersWithLessons';

const { Course } = sequelize.models;

const coursesController = {
  async getAllCourses(req: Request, res: Response) {
    const courseArray = await Course.findAll();

    res.send(courseArray);
  },
  async getCourse(req: Request, res: Response) {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    const { lessonIds, chaptersWithLessons } = await getChaptersWithLessons(id);

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
