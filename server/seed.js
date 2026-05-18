// TutorFlow Database Seed Script
// Run with: node seed.js
// Make sure your .env file is configured first!

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

const users = [
  {
    name: 'Admin User',
    email: 'admin@tutorflow.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Marcus Rivera',
    email: 'marcus@example.com',
    password: 'student123',
    role: 'student',
  },
];

const services = [
  // Mathematics
  {
    title: 'SAT Math Prep — Advanced',
    subject: 'Mathematics',
    level: 'High School',
    description: 'Targeted SAT math prep covering algebra, data analysis, advanced math, and problem-solving strategies. We focus on timed practice and test-taking techniques to maximize your score.',
    duration: 60,
    price: 75,
    tutorName: 'Dr. Priya Nair',
    available: true,
  },
  {
    title: 'Algebra I & II Foundations',
    subject: 'Mathematics',
    level: 'Middle School',
    description: 'Build a strong algebra foundation covering linear equations, inequalities, functions, polynomials, and quadratic equations. Great for students who want to strengthen their core math skills.',
    duration: 60,
    price: 55,
    tutorName: 'Mr. Daniel Brooks',
    available: true,
  },
  {
    title: 'Calculus I — Limits, Derivatives & Integrals',
    subject: 'Mathematics',
    level: 'College',
    description: 'Comprehensive Calculus I tutoring covering limits, continuity, differentiation rules, applications of derivatives, and introduction to integration. Ideal for college freshmen and AP Calc students.',
    duration: 90,
    price: 90,
    tutorName: 'Dr. Priya Nair',
    available: true,
  },
  {
    title: 'Elementary Math — Grades 3–5',
    subject: 'Mathematics',
    level: 'Elementary',
    description: 'Fun, patient, and engaging math help for younger learners. Topics include multiplication, division, fractions, decimals, and word problems — all taught using real-world examples.',
    duration: 45,
    price: 45,
    tutorName: 'Ms. Lily Chen',
    available: true,
  },

  // Science
  {
    title: 'AP Biology — Full Course Support',
    subject: 'Science',
    level: 'High School',
    description: 'In-depth AP Biology sessions covering cell biology, genetics, evolution, ecology, and physiology. Includes exam strategy and free-response practice to prepare you for the AP exam.',
    duration: 60,
    price: 70,
    tutorName: 'Ms. Rachel Torres',
    available: true,
  },
  {
    title: 'Chemistry — Intro to Organic',
    subject: 'Science',
    level: 'College',
    description: 'Tackle organic chemistry with confidence. Sessions cover nomenclature, functional groups, reaction mechanisms, stereochemistry, and spectroscopy. Perfect for pre-med and science majors.',
    duration: 90,
    price: 95,
    tutorName: 'Dr. Kevin Zhao',
    available: true,
  },
  {
    title: 'Middle School Science — Earth & Life',
    subject: 'Science',
    level: 'Middle School',
    description: 'Engaging sessions covering earth science, ecosystems, the human body, and basic chemistry. We use diagrams, experiments, and discussion to make science come alive.',
    duration: 60,
    price: 50,
    tutorName: 'Ms. Rachel Torres',
    available: true,
  },

  // English
  {
    title: 'Essay Writing & Argumentation',
    subject: 'English',
    level: 'High School',
    description: 'Master the five-paragraph essay and beyond. Sessions focus on thesis development, evidence analysis, paragraph structure, transitions, and revision strategies for academic writing.',
    duration: 60,
    price: 65,
    tutorName: 'Ms. Amara Johnson',
    available: true,
  },
  {
    title: 'Reading Comprehension — Grades 4–6',
    subject: 'English',
    level: 'Elementary',
    description: 'Build strong reading skills through guided reading, vocabulary expansion, inference practice, and text analysis. Sessions use age-appropriate books and passages tailored to your child.',
    duration: 45,
    price: 45,
    tutorName: 'Ms. Lily Chen',
    available: true,
  },
  {
    title: 'College Application Essay Coaching',
    subject: 'English',
    level: 'High School',
    description: 'Craft a compelling personal statement that stands out. Sessions guide you from brainstorming and outlining through multiple revision rounds. Includes Common App main essay and supplementals.',
    duration: 60,
    price: 85,
    tutorName: 'Ms. Amara Johnson',
    available: true,
  },

  // History
  {
    title: 'AP US History — Exam Prep',
    subject: 'History',
    level: 'High School',
    description: 'Systematic AP US History preparation covering all time periods from colonization to the modern era. Focus on DBQ writing, SAQ responses, and key historical themes tested on the AP exam.',
    duration: 60,
    price: 70,
    tutorName: 'Mr. Samuel Grant',
    available: true,
  },
  {
    title: 'World History — Middle School',
    subject: 'History',
    level: 'Middle School',
    description: 'Engaging world history sessions covering ancient civilizations, the Middle Ages, exploration, revolutions, and the modern world. We make history relevant and memorable through storytelling.',
    duration: 60,
    price: 50,
    tutorName: 'Mr. Samuel Grant',
    available: true,
  },

  // Test Prep
  {
    title: 'ACT Complete Prep — All Sections',
    subject: 'Test Prep',
    level: 'High School',
    description: 'Comprehensive ACT prep covering English, Math, Reading, and Science sections. Includes a diagnostic test, customized study plan, timed practice sets, and score-boost strategies.',
    duration: 90,
    price: 95,
    tutorName: 'Mr. Daniel Brooks',
    available: true,
  },
  {
    title: 'GRE Quantitative & Verbal',
    subject: 'Test Prep',
    level: 'Adult / Professional',
    description: 'Targeted GRE prep for graduate school applicants. Sessions cover quant fundamentals, algebra, data interpretation, reading comprehension, and text completion — with full-length practice tests.',
    duration: 90,
    price: 100,
    tutorName: 'Dr. Priya Nair',
    available: true,
  },

  // Coding
  {
    title: 'Python for Beginners',
    subject: 'Coding',
    level: 'High School',
    description: 'Start coding with Python from scratch. Sessions cover variables, data types, loops, functions, lists, and basic object-oriented programming. Build real mini-projects each session.',
    duration: 60,
    price: 75,
    tutorName: 'Mr. Leo Pham',
    available: true,
  },
  {
    title: 'Web Development — HTML, CSS & JavaScript',
    subject: 'Coding',
    level: 'Adult / Professional',
    description: 'Learn the fundamentals of web development. Sessions cover HTML structure, CSS styling and layout, JavaScript interactivity, and responsive design. Build a personal portfolio site as your final project.',
    duration: 90,
    price: 90,
    tutorName: 'Mr. Leo Pham',
    available: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);
    console.log('   Admin login:   admin@tutorflow.com / admin123');
    console.log('   Student login: jane@example.com / student123');

    // Create services
    const createdServices = await Service.create(services);
    console.log(`📚 Created ${createdServices.length} services`);

    // Create a couple of sample bookings for the student
    const student = createdUsers.find(u => u.email === 'jane@example.com');
    const sampleBookings = [
      {
        user: student._id,
        service: createdServices[0]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '2:00 PM',
        status: 'upcoming',
      },
      {
        user: student._id,
        service: createdServices[7]._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        time: '10:00 AM',
        status: 'completed',
        notes: 'Worked on thesis statements and paragraph structure for the persuasive essay unit.',
        aiSummary: '',
      },
    ];
    await Booking.create(sampleBookings);
    console.log('📅 Created 2 sample bookings');

    console.log('\n🎉 Database seeded successfully! You\'re ready to go.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
