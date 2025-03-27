"use client";

import Image from "next/image";
import phone from "../../../public/Phone.svg";
import Mail from "../../../public/mail.svg";
import location from "../../../public/location_on.svg";
import { useState } from "react";
import Select from "react-select";

const subjectOptions = [
    {
        label: "Test Prep",
        options: [
            { value: "sat", label: "SAT" },
            { value: "act", label: "ACT" }
        ]
    },
    {
        label: "AP Sciences",
        options: [
            { value: "ap_biology", label: "AP Biology" },
            { value: "ap_chemistry", label: "AP Chemistry" },
            { value: "ap_environmental_science", label: "AP Environmental Science" },
            { value: "ap_physics_1", label: "AP Physics 1: Algebra-Based" },
            { value: "ap_physics_2", label: "AP Physics 2: Algebra-Based" },
            { value: "ap_physics_c_electricity", label: "AP Physics C: Electricity and Magnetism" },
            { value: "ap_physics_c_mechanics", label: "AP Physics C: Mechanics" }
        ]
    },
    {
        label: "AP Math & Computer Sciences",
        options: [
            { value: "ap_calculus_AB", label: "AP Calculus AB" },
            { value: "ap_calculus_BC", label: "AP Calculus BC" },
            { value: "ap_computer_science_a", label: "AP Computer Science A" },
            { value: "ap_computer_science_principles", label: "AP Computer Science Principles" },
            { value: "ap_precalculus", label: "AP Precalculus" },
            { value: "ap_statistics", label: "AP Statistics" },
        ]
    }
];

export default function Page() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        subjects: []
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (selectedOptions: any) => {
        setForm({ ...form, subjects: selectedOptions });
    };

    return (
        <div className="w-full max-w-[1512px] mx-auto h-auto bg-[#fbf8f6] p-4 flex flex-col items-center min-h-screen justify-center">
            <div className="text-[#96aa97] text-5xl font-bold font-['Josefin_Sans'] text-left my-6 w-full max-w-[1200px]">
                Contact
            </div>
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center gap-8 text-[#494a4a] text-lg md:text-2xl font-['Josefin_Sans']">
                <div className="flex items-center gap-2">
                    <Image src={phone} alt="Phone" width={40} height={40} />
                    <span>808-590-8087</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={Mail} alt="Mail" width={47} height={47} />
                    <span>audiseatutoring@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={location} alt="Location" width={42} height={42} />
                    <span>Newport Beach, CA</span>
                </div>
            </div>
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-4 font-bold justify-center mt-6">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full md:w-1/2 h-[104px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-2xl font-['Josefin_Sans'] focus:outline-none"
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full md:w-1/2 h-[104px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-2xl font-bold font-['Josefin_Sans'] focus:outline-none"
                />
            </div>
            <div className="w-full max-w-[1200px] mt-4">
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
            <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full max-w-[1200px] h-[248px] bg-[#e7e5e3] rounded-[10px] mt-4 p-4 text-[#494a4a] text-lg md:text-2xl font-bold font-['Josefin_Sans'] focus:outline-none resize-none"
            />
        </div>
    );
}
