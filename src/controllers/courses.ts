import { Request, Response } from 'express';
import sequelize from '../models';

const Course = sequelize.models.Course;
const Chapter = sequelize.models.Chapter;

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
    });

    console.log(courseChapters);

    res.send(course);
  },
};

export default coursesController;
