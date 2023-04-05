import { Request, Response } from 'express';

import sequelize from '../models';

const { Lesson, Chapter } = sequelize.models;

const lessonsController = {
  async getLesson(req: Request, res: Response) {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    const { id: lessonId, title, content, position: lessonPosition, chapterId } = lesson?.dataValues;

    const chapter = await Chapter.findByPk(chapterId);

    const {position: chapterPosition} = chapter?.dataValues;

    const responseData = {
      id: lessonId,
      title,
      content,
      position: `${chapterPosition}.${lessonPosition}`
    }

    res.send(responseData);
  },
};

export default lessonsController;
