"use client";
import Image from "next/image";
import home from "../../public/home.svg";
import whyUs1 from "../../public/whyUs-1.svg";
import whyUs2 from "../../public/whyUs-2.svg";
import whyUs3 from "../../public/whyUs-3.svg";

import leadImage from "../../public/Group 16.svg";
import whyUsElipse from "../../public/whyUsElipse.svg";
import { useState, useEffect } from "react";
import { testimonials, offerings } from "@/data/constants";
import OfferingCard from "@/components/OfferingCard";



export default function Home() {
  return (
    <div>
      <Hero />
      <WhyUs />
      <Offerings />
      <Testimonials />
      <Contact />
    </div>
  );
}

function Hero() {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#FBF8F6] overflow-hidden">
      <div className="mt-10"></div>
      <main className="flex flex-col items-center justify-center flex-1 p-6 md:flex-row md:items-center md:justify-center">
        <div className="relative w-full md:w-auto">
          <Image src={home} alt="home1" className="w-full h-auto md:w-125 md:h-125" />
        </div>
        <div className="text-center mt-6 md:mt-0 md:text-right md:ml-16">
          <h1 className="text-[#96aa97] text-4xl md:text-6xl lg:text-9xl font-bold font-['Josefin_Sans']">Audisea</h1>
          <p className="mt-4 text-[#494a4a] text-xl md:text-2xl lg:text-4xl font-['Josefin_Sans']">
            Private tutoring by <span className="font-bold">passionate</span> people.
          </p>
          <button
            onClick={() => window.location.href = "/contact"}
            className="mt-4 px-6 py-3 rounded-full border border-[#2c2c2c] text-[#494a4a] text-lg md:text-xl lg:text-2xl font-['Josefin_Sans'] transition-transform transform hover:scale-105 hover:bg-[#2c2c2c] hover:text-white"
          >
            Get Started Now
          </button>
        </div>
      </main>
    </div>
  );
}

function WhyUs() {
  return (
    <div className="w-screen bg-[#96aa97] py-10 px-6 sm:px-20">
      <h1 className="text-white text-4xl sm:text-5xl lg:text-5xl font-bold font-['Josefin_Sans'] text-center mb-10">
        Why Audisea?
      </h1>
      <div className="flex flex-wrap justify-evenly gap-10 px-0 sm:px-0 lg:px-0">
        <div className="flex flex-col items-center flex-1 min-w-[250px] relative">
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[271px] lg:h-[271px] bg-[#fbf8f6] rounded-full flex items-center justify-center relative">
            <Image src={whyUs1} alt="Personalized" className="w-full h-full rounded-full" />
            <Image
              src={whyUsElipse}
              alt="Elipse"
              className="absolute top-[-5px] right-[-5px] w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]"
            />
          </div>
          <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold font-['Josefin_Sans'] mt-4 text-center">
            Personalized
          </h2>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[250px] relative">
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[271px] lg:h-[271px] bg-[#fbf8f6] rounded-full flex items-center justify-center relative">
            <Image src={whyUs2} alt="Personalized" className="w-full h-full rounded-full" />
            <Image
              src={whyUsElipse}
              alt="Elipse"
              className="absolute bottom-[-5px] right-[-5px] w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]"
            />
          </div>
          <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold font-['Josefin_Sans'] mt-4 text-center">
            Personalized
          </h2>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[250px] relative">
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[271px] lg:h-[271px] bg-[#fbf8f6] rounded-full flex items-center justify-center relative">
            <Image src={whyUs3} alt="Personalized" className="w-full h-full rounded-full" />
            <Image
              src={whyUsElipse}
              alt="Elipse"
              className="absolute top-[-5px] right-[-5px] w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]"
            />
          </div>
          <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold font-['Josefin_Sans'] mt-4 text-center">
            Personalized
          </h2>
        </div>
      </div>
    </div>
  );
}

function Offerings() {
  return (
    <div className="w-screen bg-[url('/../../offeringBg.svg')] p-10 sm:p-20">
      <h1 className="text-[#494a4a] font-bold font-['Josefin_Sans'] text-[60px] mb-[10px] text-center sm:text-left">Offerings</h1>
      <h3 className="text-[#494a4a] font-['Josefin_Sans'] text-[24px] mb-[40px] text-center sm:text-left">
        We offer all kinds of test preparation. You can be sure that we can make your child succeed.
      </h3>
      <div className="w-full flex flex-wrap justify-center gap-5 sm:gap-10">
        {offerings.map((offering, index) => (
          <OfferingCard
            key={index}
            title={offering.title}
            buttonText={offering.buttonText}
            description={offering.description}
          />
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const getVisibleCount = () => {
      if (typeof window === 'undefined') return 1;
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      if (window.innerWidth >= 640) return 3;
      if (window.innerWidth >= 400) return 2;
      return 1;
    };

    setVisibleCount(getVisibleCount());

    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prevTestimonial = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - visibleCount : prev - visibleCount
    );
  };

  const nextTestimonial = () => {
    setIndex((prev) =>
      prev + visibleCount >= testimonials.length ? 0 : prev + visibleCount
    );
  };

  return (
    <div className="w-full bg-[#96aa97] py-16 px-6 flex flex-col items-center">
      <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10">
        Don’t just take it from us!
      </h2>

      <div className="relative w-full max-w-7xl overflow-hidden">
        <div className="flex items-center justify-center flex-col sm:flex-row">
          {/* Left Button */}
          <button
            onClick={prevTestimonial}
            className="sm:mr-8 mb-4 sm:mb-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-200"
          >
            &lt;
          </button>

          {/* Carousel */}
          <div className="relative w-full max-w-7xl flex justify-center overflow-hidden">
            <div className="flex space-x-6">
              {testimonials.slice(index, index + visibleCount).map((testimonial, idx) => (
                <div key={idx} className="w-full sm:w-[280px] md:w-[340px] p-6 bg-white rounded-lg shadow-md">
                  <p className="text-gray-800 text-lg font-semibold mb-4">“{testimonial.quote}”</p>
                  <div className="text-gray-600 font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={nextTestimonial}
            className="sm:ml-8 mt-4 sm:mt-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}



function Contact() {
  return (
    <div className="w-full h-auto relative overflow-hidden bg-white py-16 px-10 sm:px-40">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left text-[#494a4a] text-4xl sm:text-5xl lg:text-6xl font-bold font-['Josefin_Sans'] mb-8 sm:mb-0">
          Want to learn more?
          <div className="mt-4">
            <button
              onClick={() => window.location.href = "/contact"}
              className="bg-[#2C2C2C] text-white text-lg sm:text-xl px-6 py-3 rounded-lg transition border-2 border-transparent hover:bg-white hover:text-[#2C2C2C] hover:border-[#2C2C2C]"
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <Image src={leadImage} alt="Why Us" className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px]" />
        </div>
      </div>
    </div>
  );
}
