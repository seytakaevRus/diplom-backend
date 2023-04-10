import { Request, Response } from 'express';

import { SERVER_ERROR } from '../constants';
import sequelize from '../models';

const { Review, User } = sequelize.models;

interface CourseReview {
  id: number;
  rating: number;
  courseId: number;
  userFullName: string;
  review: string;
}

const reviewsController = {
  async createReview(req: Request, res: Response) {
    const { userId, courseId, rating, review } = req.body;

    try {
      await Review.create({ userId, courseId, rating, review });

      res.status(201).send('Review was created');
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
  async getReviewsByCourseId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const reviews = await Review.findAll({
        where: {
          courseId: id,
        },
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName'],
          },
        ],
        order: [['id', 'ASC']],
      });

      const courseReviews = reviews.reduce<CourseReview[]>(
        (acc, { dataValues }) => {
          const { firstName, lastName } = dataValues.User.dataValues;

          acc.push({
            id: dataValues.id,
            rating: dataValues.rating,
            courseId: dataValues.courseId,
            review: dataValues.review,
            userFullName: `${firstName} ${lastName}`,
          });

          return acc;
        },
        [],
      );
      
      res.status(200).send(courseReviews);
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

export default reviewsController;
