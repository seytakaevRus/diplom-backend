import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

interface ReviewAttributes {
  id: number;
  review: string;
  rating: number;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id'>;

const initReviewModel = (sequelize: Sequelize) => {
  const Review: ModelDefined<ReviewAttributes, ReviewCreationAttributes> =
    sequelize.define(
      'Review',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          unique: true,
          primaryKey: true,
        },
        review: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: 'reviews',
      },
    );

  return Review;
};

export default initReviewModel;
