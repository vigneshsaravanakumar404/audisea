"use client";

import Image from "next/image";
import { Suspense } from 'react'
import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { useSearchParams } from 'next/navigation'
import Mail from "../../../public/mail.svg";
import phone from "../../../public/Phone.svg";
import location from "../../../public/location_on.svg";
import { subjectOptions } from "@/data/constants";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactForm />
        </Suspense>
    );
}

function ContactForm() {
    const params = useSearchParams();
    const search = params.get('subject');
    type SubjectOption = { value: string; label: string };


    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        subjects: search ? subjectOptions.flatMap(group => group.options).filter(option => option.value === search) : [] as SubjectOption[],
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (newValue: MultiValue<SubjectOption>) => {
        setForm(prevForm => ({ ...prevForm, subjects: newValue as SubjectOption[] }));
    };

    const validateForm = () => {
        const newErrors = { name: "", email: "", message: "" };
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
        if (!form.message) newErrors.message = "Message is required";
        setErrors(newErrors);
        return Object.values(newErrors).every(err => err === "");
    };

    const handleSubmit = () => {
        if (validateForm()) {
            window.location.href = "/contact";
        }
    };

    return (
        <Suspense>
            <div className="w-full max-w-[1512px] mx-auto min-h-screen bg-[#fbf8f6] px-4 flex flex-col items-center pt-24 pb-16">
                {/* Heading and subtitle */}
                <div className="w-full max-w-[900px] mx-auto text-center mb-8">
                    <h1 className="text-[#96aa97] text-5xl font-bold font-['Josefin_Sans'] mb-2">Contact</h1>
                    <p className="text-[#7a7b7b] text-lg md:text-xl font-['Josefin_Sans']">
                        We'd love to hear from you! Fill out the form below and our team will get back to you as soon as possible.
                    </p>
                </div>
                {/* Contact Info */}
                <div className="w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10 py-6 border-y border-[#e7e5e3] bg-[#f8faf8] rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <Image src={phone} alt="Phone" width={40} height={40} />
                        <span className="text-[#494a4a] text-lg md:text-xl">808-590-8087</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <Image src={Mail} alt="Mail" width={47} height={47} />
                        <span className="text-[#494a4a] text-lg md:text-xl">audiseatutoring@gmail.com</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <Image src={location} alt="Location" width={42} height={42} />
                        <span className="text-[#494a4a] text-lg md:text-xl">Newport Beach, CA</span>
                    </div>
                </div>
                {/* Form */}
                <div className="w-full max-w-[900px] flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-6 font-bold">
                        <div className="w-full md:w-1/2">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full h-[64px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-xl font-['Josefin_Sans'] focus:outline-none"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div className="w-full md:w-1/2">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full h-[64px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-xl font-bold font-['Josefin_Sans'] focus:outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <Select
                            isMulti
                            options={subjectOptions}
                            value={form.subjects}
                            onChange={handleSubjectChange}
                            placeholder="Select Subjects"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#e7e5e3",
                                    borderRadius: "10px",
                                    borderColor: "#e7e5e3",
                                    padding: "6px 10px",
                                    boxShadow: "none",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                    fontWeight: "bold",
                                }),
                                multiValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#96aa97",
                                    borderRadius: "10px",
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: "#fff",
                                    fontSize: "14px",
                                    padding: "4px 8px",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }),
                                multiValueRemove: (provided) => ({
                                    ...provided,
                                    color: "#fff",
                                    cursor: "pointer",
                                    ':hover': {
                                        backgroundColor: "#d9d9d9",
                                    }
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#fbf8f6",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? "#96aa97" : "#fbf8f6",
                                    color: state.isSelected ? "#fff" : "#494a4a",
                                    cursor: "pointer",
                                    padding: "10px 20px",
                                    ':hover': {
                                        backgroundColor: "#e7e5e3",
                                    },
                                    fontFamily: "'Josefin Sans', sans-serif",
                                })
                            }}
                        />
                    </div>
                    <div>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Message"
                            className="w-full h-[180px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-xl font-bold font-['Josefin_Sans'] focus:outline-none resize-none"
                        />
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#96aa97] text-white text-lg sm:text-xl px-8 py-3 rounded-full font-semibold shadow hover:bg-[#7a8f7b] transition-colors border-2 border-[#96aa97] hover:border-[#7a8f7b] focus:outline-none focus:ring-2 focus:ring-[#96aa97] mt-2"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </Suspense>
    );
}
