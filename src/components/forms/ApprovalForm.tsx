"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { teacherSchema, studentSchema, parentSchema, TeacherSchema, StudentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { approveTeacher, approveStudent, approveParent } from "@/lib/actions";

const ApprovalForm = ({
    setOpen,
    data,
    relatedData,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    data?: any;
    relatedData?: any;
}) => {
    const role = data?.role;
    const resolver = role === "teacher" ? teacherSchema : role === "student" ? studentSchema : parentSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(resolver),
        defaultValues: {
            id: data?.id,
            username: data?.username,
            email: data?.email,
            password: "PASSWORD_ALREADY_SET", // Dummy since it's already set in Clerk
        }
    });

    const [state, formAction] = useFormState(
        role === "teacher" ? approveTeacher : role === "student" ? approveStudent : approveParent,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((formData) => {
        formAction(formData);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`User has been approved!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Approve {role} Registration</h1>
            <span className="text-xs text-gray-400 font-medium font-medium">
                Complete the profile for {data?.username}
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

                    </>
                )}

                {role === "student" && (
                    <>
                        <div className="flex flex-col gap-2 w-full md:w-[48%]">
                            <label className="text-xs text-gray-500">Year of Study</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("gradeId")}
                            >
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
                            <label className="text-xs text-gray-500">Course</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("classId")}
                            >
                                {relatedData?.classes?.map((classItem: any) => (
                                    <option value={classItem.id} key={classItem.id}>
                                        {classItem.name} -{" "}
                                        {classItem._count.students + "/" + classItem.capacity}{" "}
                                        Capacity
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
                            <label className="text-xs text-gray-500">Parent ID</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("parentId")}
                            >
                                {relatedData?.parents?.map((parent: any) => (
                                    <option value={parent.id} key={parent.id}>
                                        {parent.name} {parent.surname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {role === "teacher" && (
                    <div className="flex flex-col gap-2 w-full md:w-[48%]">
                        <label className="text-xs text-gray-500">Units</label>
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

            <button className="bg-blue-400 text-white p-2 rounded-md">
                Confirm Approval
            </button>
        </form>
    );
};

export default ApprovalForm;
