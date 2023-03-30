import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

interface LessonAttributes {
  id: number;
  title: string;
  content: string;
}

type LessonCreationAttributes = Optional<LessonAttributes, 'id'>;

const initLessonModel = (sequelize: Sequelize) => {
  const Lesson: ModelDefined<LessonAttributes, LessonCreationAttributes> =
    sequelize.define(
      'Lesson',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          unique: true,
          primaryKey: true,
        },

        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      },
    );

  return Lesson;
};

export default initLessonModel;
