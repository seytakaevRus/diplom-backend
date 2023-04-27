import sequelize from '../models';

const { Chapter, Lesson } = sequelize.models;

interface ChapterWithLessons {
  id: number;
  title: string;
  lessons: {
    id: number;
    title: string;
  }[];
}

export const getChaptersWithLessons = async (courseId: string) => {
  const courseChapters = await Chapter.findAll({
    where: {
      courseId,
    },
    order: [['id', 'ASC']],
  });

  const lessonIds: number[] = [];
  const chaptersWithLessons: ChapterWithLessons[] = [];

  for (const { dataValues: chapterData } of courseChapters) {
    const chapterWithLessons: ChapterWithLessons = {
      id: chapterData.id,
      title: chapterData.title,
      lessons: [],
    };

    const chapterLessons = await Lesson.findAll({
      where: {
        chapterId: chapterData.id,
      },
      order: [['id', 'ASC']],
    });

    for (const { dataValues: lessonData } of chapterLessons) {
      chapterWithLessons.lessons.push({
        id: lessonData.id,
        title: lessonData.title,
      });

      lessonIds.push(lessonData.id);
    }

    chaptersWithLessons.push(chapterWithLessons);
  }

  return { chaptersWithLessons, lessonIds };
};
