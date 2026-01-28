"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { teacherSchema, studentSchema, parentSchema } from "@/lib/formValidationSchemas";
import { createTeacher, createStudent, createParent } from "@/lib/actions";

// We use the 'create' actions because the Prisma record doesn't exist yet
// The actions will need to be slightly modified or we create a new one 'completeProfile'

const CompleteProfileForm = ({
    user,
    relatedData,
}: {
    user: any;
    relatedData?: any;
}) => {
    const role = user?.publicMetadata?.role as string;
    const resolver = role === "teacher" ? teacherSchema : role === "student" ? studentSchema : parentSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(resolver),
        defaultValues: {
            id: user?.id,
            username: user?.username || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
            name: user?.firstName || "",
            surname: user?.lastName || "",
            password: "PASSWORD_ALREADY_SET",
        }
    });

    const [state, formAction] = useFormState(
        role === "teacher" ? createTeacher : role === "student" ? createStudent : createParent,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((formData) => {
        // We override the 'role' and 'id' as they come from Clerk
        formAction(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Profile completed successfully!`);
            // Redirect to the appropriate dashboard
            window.location.href = `/${role}`;
        }
    }, [state, role]);

    return (
        <form className="flex flex-col gap-8 bg-white p-8 rounded-md shadow-md" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Complete Your {role} Profile</h1>
            <span className="text-xs text-gray-400 font-medium">
                Please provide the remaining details to access your dashboard.
            </span>

            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("username")} />
            <input type="hidden" {...register("password")} />
            <input type="hidden" {...register("email")} />

            <div className="flex flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="name"
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last Name"
                    name="surname"
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                />

                {role !== "parent" && (
                    <>
                        <InputField
                            label="Birthday"
                            name="birthday"
                            type="date"
                            register={register}
                            error={errors.birthday}
                        />
                        <div className="flex flex-col gap-2 w-full md:w-[48%]">
                            <label className="text-xs text-gray-500">Sex</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("sex")}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                            {errors.sex?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.sex.message.toString()}
                                </p>
                            )}
                        </div>
                        <InputField
                            label="Blood Type"
                            name="bloodType"
                            register={register}
                            error={errors.bloodType}
                        />
                    </>
                )}

                {role === "student" && (
                    <>
                        <div className="flex flex-col gap-2 w-full md:w-[48%]">
                            <label className="text-xs text-gray-500">Grade</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("gradeId")}
                            >
                                <option value="">Select Grade</option>
                                {relatedData?.grades?.map((grade: any) => (
                                    <option value={grade.id} key={grade.id}>
                                        {grade.level}
                                    </option>
                                ))}
                            </select>
                            {errors.gradeId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.gradeId.message.toString()}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-[48%]">
                            <label className="text-xs text-gray-500">Class</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("classId")}
                            >
                                <option value="">Select Class</option>
                                {relatedData?.classes?.map((classItem: any) => (
                                    <option value={classItem.id} key={classItem.id}>
                                        {classItem.name} ({classItem._count.students}/{classItem.capacity})
                                    </option>
                                ))}
                            </select>
                            {errors.classId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.classId.message.toString()}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-[48%]">
                            <label className="text-xs text-gray-500">Parent</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("parentId")}
                            >
                                <option value="">Select Parent</option>
                                {relatedData?.parents?.map((parent: any) => (
                                    <option value={parent.id} key={parent.id}>
                                        {parent.name} {parent.surname}
                                    </option>
                                ))}
                            </select>
                            {errors.parentId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.parentId.message.toString()}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {role === "teacher" && (
                    <div className="flex flex-col gap-2 w-full md:w-[48%]">
                        <label className="text-xs text-gray-500">Subjects</label>
                        <select
                            multiple
                            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                            {...register("subjects")}
                        >
                            {relatedData?.subjects?.map((subject: any) => (
                                <option value={subject.id} key={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
                Finalize Profile
            </button>
        </form>
    );
};

export default CompleteProfileForm;
