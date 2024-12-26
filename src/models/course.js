const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    metadata:{
      title: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: String, required: true },
    },
    tags: {
      beforePaymentTags: [
        {
          type: String,
        },
      ],
      afterPaymentTags: [
        {
          type: String,
        },
      ],
    },
    slug: { type: String, required: true, unique: true },
    heroSection: {
      courseImage: { type: String, required: true },
      titleSm: { type: String, required: true },
      title1: { type: String, required: true },
      titleHighlight: { type: String, required: true },
      title2: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      discount: { type: Number, required: true },
      hoursLeft: { type: Number, required: true },
      studentCount: { type: String, required: true },
      rating: { type: String, required: true },
      reviewCount: { type: String, required: true },
      courseIncludes: [
        {
          icon: { type: String, required: true },
          text: { type: String, required: true },
        },
      ],
      iframeHtml: { type: String, required: true },
    },

    learningSection: {
      title: { type: String, required: true },
      cards: [
        {
          color: { type: String, required: true },
          image: { type: String, required: true },
          title: { type: String, required: true },
        },
      ],
    },

    companyLogosSection: {
      title: { type: String, required: true },
      companies: [
        {
          name: { type: String, required: true },
          image: { type: String, required: true },
        },
      ],
    },

    courseContentSection: {
      title: { type: String, required: true },
      summary: {
        totalSections: { type: Number, required: true },
        totalLectures: { type: Number, required: true },
        totalDuration: { type: String, required: true },
      },
      sections: [
        {
          title: { type: String, required: true },
          lectures: { type: String, required: true },
          duration: { type: String, required: true },
          content: [{
            type: { type: String, required: true },
            content: { type: String, required: true },
            duration: { type: String, required: true }
          }]
        }
      ]
    },

    requirementsSection: {
      title: { type: String, required: true },
      cards: [
        {
          title: { type: String, required: true },
          image: { type: String, required: true },
          bgColor: { type: String, required: true },
        },
      ],
    },

    descriptionSection: {
      title: { type: String, required: true },
      shortDescription: { type: String, required: true },
      fullDescription: { type: String, required: true },
    },

    instructorSection: {
      title: { type: String, required: true },
      name: { type: String, required: true },
      position: { type: String, required: true },
      description: { type: String, required: true },
      quote: { type: String, required: true },
      image: { type: String, required: true },
      stats: [
        {
          icon: { type: String, required: true },
          text: { type: String, required: true },
        },
      ],
      socialLinks: [
        {
          platform: { type: String, required: true },
          icon: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },

    testimonialsSection: {
      title: { type: String, required: true },
      testimonials: [
        {
          name: { type: String, required: true },
          review: { type: String, required: true },
          date: { type: String, required: true },
          rating: { type: Number, required: true },
        },
      ],
    },

    bonusesSection: {
      title: {
        main: { type: String, required: true },
        highlight1: { type: String, required: true },
        highlight2: { type: String, required: true },
        amount: { type: String, required: true },
      },
      mockupImage: { type: String, required: true },
      carouselItems: [
        {
          id: { type: Number, required: true },
          title: { type: String, required: true },
          color: { type: String, required: true },
          courses: [{ type: String, required: true }],
        },
      ],
    },
    counterSection: {
      title: {
        main: { type: String, required: true },
        subtitle: { type: String, required: true },
      },
      initialTimer: {
        hours: { type: Number, required: true },
        minutes: { type: Number, required: true },
        seconds: { type: Number, required: true },
      },
      bonusAmount: { type: String, required: true },
      button: {
        mainText: { type: String, required: true },
        subText: { type: String, required: true },
        price: { type: String, required: true },
      },
      footerText: { type: String, required: true },
      backgroundGradient: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Courses = mongoose.model("Course", courseSchema);

module.exports = Courses;
