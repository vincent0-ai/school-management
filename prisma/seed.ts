import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // CLEANUP
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.student.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();

  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        id: i,
        level: i,
      },
    });
  }

  // CLASS (Now representing Courses)
  const courseNames = [
    "BSc Computer Science",
    "BSc Information Technology",
    "BSc Software Engineering",
    "BSc Data Science",
    "BSc Cybersecurity",
    "BSc Artificial Intelligence"
  ];
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        id: i,
        name: courseNames[i - 1],
        gradeId: i,
        capacity: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
      },
    });
  }

  // SUBJECT (Now representing Units/Modules)
  const subjectData = [
    { name: "Introduction to Programming" },
    { name: "Data Structures and Algorithms" },
    { name: "Database Management Systems" },
    { name: "Operating Systems" },
    { name: "Computer Networks" },
    { name: "Software Engineering" },
    { name: "Web Development" },
    { name: "Machine Learning" },
    { name: "Discrete Mathematics" },
    { name: "Object-Oriented Programming" },
  ];

  for (let i = 0; i < subjectData.length; i++) {
    await prisma.subject.create({
      data: {
        id: i + 1,
        ...subjectData[i],
      },
    });
  }

  // TEACHER (Now representing Lecturers)
  const lecturerNames = [
    { name: "Dr. James", surname: "Mwangi" },
    { name: "Prof. Sarah", surname: "Ochieng" },
    { name: "Dr. Michael", surname: "Kimani" },
    { name: "Dr. Grace", surname: "Wanjiku" },
    { name: "Prof. David", surname: "Otieno" },
    { name: "Dr. Mary", surname: "Njeri" },
    { name: "Dr. John", surname: "Kamau" },
    { name: "Prof. Jane", surname: "Akinyi" },
    { name: "Dr. Peter", surname: "Omondi" },
    { name: "Dr. Elizabeth", surname: "Wambui" },
    { name: "Prof. Robert", surname: "Kiprop" },
    { name: "Dr. Anne", surname: "Chebet" },
    { name: "Dr. Charles", surname: "Mutua" },
    { name: "Prof. Lucy", surname: "Muthoni" },
    { name: "Dr. Daniel", surname: "Korir" },
  ];
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `lecturer${i}`,
        name: lecturerNames[i - 1].name,
        surname: lecturerNames[i - 1].surname,
        email: `lecturer${i}@university.ac.ke`,
        phone: `+254-7${String(i).padStart(2, '0')}-123-456`,
        address: `University Campus, Building ${i}`,
        bloodType: "",
        sex: i % 2 === 0 ? "MALE" : "FEMALE",
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 40)),
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        id: i,
        name: `Lesson${i}`,
        day: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"][Math.floor(Math.random() * 5)],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: (i % 10) + 1,
        classId: (i % 6) + 1,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }

  // PARENT (Now representing Guardians/Emergency Contacts)
  const guardianFirstNames = ["Joseph", "Mary", "Peter", "Elizabeth", "Samuel", "Catherine", "David", "Rose", "William", "Grace", "James", "Agnes", "Philip", "Joyce", "Daniel", "Margaret", "Stephen", "Florence", "George", "Alice", "Thomas", "Beatrice", "Charles", "Nancy", "Michael"];
  const guardianLastNames = ["Odhiambo", "Wanjiru", "Kiplagat", "Nyambura", "Ochieng", "Mwende", "Mutiso", "Wairimu", "Karanja", "Cherop", "Odongo", "Wangari", "Kimani", "Adhiambo", "Korir", "Nyokabi", "Maina", "Chelimo", "Njoroge", "Wafula", "Nzomo", "Kemboi", "Gitonga", "Atieno", "Kiptoo"];
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `guardian${i}`,
        name: guardianFirstNames[i - 1],
        surname: guardianLastNames[i - 1],
        email: `${guardianFirstNames[i - 1].toLowerCase()}.${guardianLastNames[i - 1].toLowerCase()}@email.com`,
        phone: `+254-7${String(i).padStart(2, '0')}-987-654`,
        address: `Nairobi, Kenya`,
      },
    });
  }

  // STUDENT (University Students)
  const studentFirstNames = ["John", "Jane", "Kevin", "Faith", "Brian", "Mercy", "Dennis", "Esther", "Patrick", "Sharon"];
  const studentLastNames = ["Otieno", "Wanjiku", "Mwangi", "Achieng", "Kiprop", "Njeri", "Kamau", "Chebet", "Omondi", "Wambui"];
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: studentFirstNames[i % 10],
        surname: studentLastNames[(i + 3) % 10],
        email: `student${i}@students.university.ac.ke`,
        phone: `+254-7${String(20 + i).padStart(2, '0')}-456-789`,
        address: `Student Hostel, Room ${i}`,
        bloodType: "",
        sex: i % 2 === 0 ? "MALE" : "FEMALE",
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 22)),
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        id: i,
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        id: i,
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: true,
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
