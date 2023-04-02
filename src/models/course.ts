import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

import { audienceType } from '../constants/audience';

interface CourseAttributes {
  id: number;
  title: string;
  audience: keyof typeof audienceType;
}

type CourseCreationAttributes = Optional<CourseAttributes, 'id'>;

const initCourseModel = (sequelize: Sequelize) => {
  const Course: ModelDefined<CourseAttributes, CourseCreationAttributes> =
    sequelize.define(
      'Course',
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
        audience: {
          type: DataTypes.ENUM(audienceType.child, audienceType.teenager),
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: 'courses',
      },
    );

  return Course;
};

export default initCourseModel;
