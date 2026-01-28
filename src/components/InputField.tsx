"use client";

import { FieldError } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4 relative"}>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full pr-10"
          {...inputProps}
          defaultValue={defaultValue}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? "/view.png" : "/view.png"}
              alt=""
              width={16}
              height={16}
              className={showPassword ? "" : "opacity-50"}
            />
          </button>
        )}
      </div>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
