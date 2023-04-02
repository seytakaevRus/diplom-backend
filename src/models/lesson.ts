import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

interface LessonAttributes {
  id: number;
  title: string;
  content: string;
  position: number;
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
          type: DataTypes.TEXT,
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: 'lessons',
      },
    );

  return Lesson;
};

export default initLessonModel;
