"use client";

import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AnnouncementForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const { classes } = relatedData || {};

    return (
        <form className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new announcement" : "Update the announcement"}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
                Announcement form is under construction.
            </span>
            <button type="button" onClick={() => setOpen(false)} className="bg-blue-400 text-white p-2 rounded-md">
                Close
            </button>
        </form>
    );
};

export default AnnouncementForm;
