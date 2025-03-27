"use client";

import Image from "next/image";
import { useState } from "react";
import Select from "react-select";
import { useSearchParams } from 'next/navigation'
import Mail from "../../../public/mail.svg";
import phone from "../../../public/Phone.svg";
import location from "../../../public/location_on.svg";
import { subjectOptions } from "@/data/constants";

export default function Page() {
    const searchParams = useSearchParams();
    const search = searchParams.get('subject');

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        subjects: search ? subjectOptions.flatMap(group => group.options).filter(option => search?.split(',').includes(option.value)) : []
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (selectedOptions) => {
        setForm({ ...form, subjects: selectedOptions });
    };

    const validateForm = () => {
        let newErrors = { name: "", email: "", message: "" };
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
        <div className="w-full max-w-[1512px] mx-auto h-auto bg-[#fbf8f6] p-4 flex flex-col items-center min-h-screen justify-center">
            <div className="text-[#96aa97] text-5xl font-bold font-['Josefin_Sans'] text-left mt-4 w-full max-w-[1200px]">
                Contact
            </div>
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center gap-0 md:gap-8 text-[#494a4a] text-lg md:text-2xl font-['Josefin_Sans']">
                <div className="flex items-center gap-2">
                    <Image src={phone} alt="Phone" width={40} height={40} />
                    <span>808-590-8087</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={Mail} alt="Mail" width={47} height={47} />
                    <span>vignesh.saravanakumar.vs@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={location} alt="Location" width={42} height={42} />
                    <span>Newport Beach, CA</span>
                </div>
            </div>
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-4 font-bold justify-center mt-6">
                <div className="w-full md:w-1/2">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full h-[104px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-2xl font-['Josefin_Sans'] focus:outline-none"
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
                        className="w-full h-[104px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-2xl font-bold font-['Josefin_Sans'] focus:outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
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
                        })
                    }}
                />
            </div>
            <div className="w-full max-w-[1200px] mt-4">
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full h-[248px] bg-[#e7e5e3] rounded-[10px] p-4 text-[#494a4a] text-lg md:text-2xl font-bold font-['Josefin_Sans'] focus:outline-none resize-none"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>
            <button
                onClick={handleSubmit}
                className="bg-[#2C2C2C] text-white text-lg sm:text-xl px-6 py-3 rounded-lg transition border-2 border-transparent hover:bg-white hover:text-[#2C2C2C] hover:border-[#2C2C2C] mt-3"
            >
                Submit
            </button>
        </div>
    );
}
