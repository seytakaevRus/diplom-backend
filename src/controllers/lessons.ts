import { Request, Response } from 'express';
import sequelize from '../models';

const { Lesson } = sequelize.models;

const lessonsController = {
  async getLesson(req: Request, res: Response) {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    const { id: lessonId, title, content, chapterId, position } = lesson?.dataValues;

    const responseData = {
      id: lessonId,
      title,
      content,
      position: `${chapterId}.${position}`
    }

    res.send(responseData);
  },
};

export default lessonsController;
