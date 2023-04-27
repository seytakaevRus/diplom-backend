import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

interface TestQuestionAttributes {
  id: number;
  description: string;
  answer: string;
  options: string;
}

type TestCreationAttributes = Optional<TestQuestionAttributes, 'id'>;

const initTestQuestionModel = (sequelize: Sequelize) => {
  const TestQuestion: ModelDefined<TestQuestionAttributes, TestCreationAttributes> =
    sequelize.define(
      'TestQuestion',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          unique: true,
          primaryKey: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        answer: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        options: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: 'test_questions',
      },
    );

  return TestQuestion;
};

export default initTestQuestionModel;
