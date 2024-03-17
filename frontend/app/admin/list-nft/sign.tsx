"use client";
import React, { useContext, useState } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/utils/cn";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { BlockchainConfig } from "@/app/Context/AppConfig";

export function SignupFormDemo() {
  const { contract } = useContext(BlockchainConfig);
  const [formData, setFormData] = useState({
    name: "",
    aadhaar: "",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const AddUser = async () => {
    let { name, aadhaar, photo } = formData;
    try {
      const tx = await contract.addUser(name, aadhaar, photo);
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction Failed");
      } else {
        alert("User added successfully!!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AddUser();
  };

  return (
    <div>
      <br />
      <br />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-8 md:p-18 pt-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to 4ntrix
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to 4ntrix if you can because we don&apos;t have a login flow yet
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="aadhaar">Aadhaar Card Number</Label>
            <Input
              id="aadhaar"
              placeholder="Aadhaar Card Number"
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="photo">Profile Photo Link</Label>
            <Input
              id="photo"
              placeholder="Profile Photo Link"
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Continue &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
