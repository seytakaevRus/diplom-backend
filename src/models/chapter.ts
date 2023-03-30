import { DataTypes, ModelDefined, Optional, Sequelize } from 'sequelize';

interface ChapterAttributes {
  id: number;
  title: string;
  position: number;
}

type ChapterCreationAttributes = Optional<ChapterAttributes, 'id'>;

const initChapterModel = (sequelize: Sequelize) => {
  const Chapter: ModelDefined<ChapterAttributes, ChapterCreationAttributes> =
    sequelize.define(
      'Chapter',
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
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      },
    );

  return Chapter;
};

export default initChapterModel;
