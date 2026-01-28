import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const { userId } = await auth();

  const student = await prisma.student.findUnique({
    where: { id: userId! },
  });

  if (!student) {
    redirect("/complete-profile");
  }

  const classItem = await prisma.class.findUnique({
    where: { id: student.classId },
  });

  if (!classItem) {
    return (
      <div className="p-4 flex gap-4 flex-col text-center items-center justify-center h-full">
        <h1 className="text-xl font-bold">Welcome to JKUAT School</h1>
        <p className="text-gray-500 my-4">You are not assigned to a valid class. Please contact an administrator.</p>
      </div>
    )
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem.name})</h1>
          <BigCalendarContainer type="classId" id={classItem.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
