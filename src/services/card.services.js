const CourseCard = require("../models/courseCards");

const newCardCreation = async (courseData, courseId) => {
  try {
    const demoCourseCard = new CourseCard({
      title: courseData.metadata.title,
      description: courseData.metadata.description,
      image: courseData.heroSection.courseImage,
      link: `https://sawankr.com/courses/${courseData.slug}`,
      price: courseData.heroSection.price,
      originalPrice: courseData.heroSection.originalPrice,
      rating: courseData.heroSection.rating,
      reviewsCount: Number(courseData.heroSection.reviewCount || 0),
      totalSections: courseData.courseContentSection.summary.totalSections,
      totalLectures: courseData.courseContentSection.summary.totalLectures,
      totalDuration: courseData.courseContentSection.summary.totalDuration,
      badges: ["New"],
      courseId: courseId,
    });
    await demoCourseCard.save();
  } catch (error) {
    console.log("Error While Creating Linking Card for course");
  }
};
const updateExistingCard = async (newcourseData, courseId) => {
  try {
    const updatedCard = await CourseCard.findOneAndUpdate(
      { courseId: courseId },
      {
        title: newcourseData.metadata.title,
        description: newcourseData.metadata.description,
        image: newcourseData.heroSection.courseImage,
        link: `https://sawankr.com/courses/${newcourseData.slug}`,
        price: newcourseData.heroSection.price,
        originalPrice: newcourseData.heroSection.originalPrice,
        rating: newcourseData.heroSection.rating,
        totalSections: newcourseData.courseContentSection.summary.totalSections,
        totalLectures: newcourseData.courseContentSection.summary.totalLectures,
        totalDuration: newcourseData.courseContentSection.summary.totalDuration,
        reviewsCount: Number(newcourseData.heroSection.reviewCount || 0),
      },
      { new: true }
    );

    if (!updatedCard) {
      console.log("Card not foung");
    }
    return updatedCard;
  } catch (error) {
    console.log("Error While Updating Card:", error.message);
    throw error;
  }
};
const deleteCard = async (courseId) => {
  try {
    const deletedCard = await CourseCard.findOneAndDelete({ courseId });
    if (!deletedCard) {
      console.log("Card not foung");
    }
    return deletedCard;
  } catch (error) {
    console.log("Error While Deleting Card:", error.message);
    throw error;
  }
};

module.exports = { newCardCreation, updateExistingCard, deleteCard };
