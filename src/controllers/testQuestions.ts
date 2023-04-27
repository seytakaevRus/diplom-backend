import { Request, Response } from 'express';

import { SERVER_ERROR } from '../constants';
import sequelize from '../models';

const { TestQuestion } = sequelize.models;

const testQuestionsController = {
  async getTestQuestionsByCourseId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const testQuestions = await TestQuestion.findAll({
        where: {
          courseId: id,
        },
        order: [['id', 'ASC']],
      });

      // TODO: Потом будет для options сделана отдельная таблица.
      const optionDelimiter = '|';
      const responseData = testQuestions.map(({dataValues}) => ({
        ...dataValues,
        options: dataValues.options.split(optionDelimiter),
      }))
      
      res.status(200).send(responseData);
    } catch (error: any) {
      if ('message' in error) {
        if (error.message === SERVER_ERROR) {
          res.status(500).send(error.message);
        } else {
          res.status(400).send(error.message);
        }
      }
    }
  },
};

export default testQuestionsController;
