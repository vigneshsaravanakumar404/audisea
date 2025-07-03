"use client";
import Image from "next/image";
import home from "../../public/Group 21.svg";
import whyUs1 from "../../public/whyUs-1.svg";
import whyUs2 from "../../public/whyUs-2.svg";
import whyUs3 from "../../public/whyUs-3.svg";

import leadImage from "../../public/Group 16.svg";
import whyUsElipse from "../../public/whyUsElipse.svg";
import { useState, useEffect } from "react";
import { testimonials, offerings } from "@/data/constants";
import { Quote } from "lucide-react"
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
    <section className="w-full min-h-screen flex items-center justify-center bg-[#FBF8F6] overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-6 py-12 gap-12 md:gap-24">
        <div className="flex-1 flex justify-center items-center">
          <Image src={home} alt="home1" className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto drop-shadow-xl" />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
          <h1 className="text-primary text-4xl md:text-6xl lg:text-8xl font-bold font-['Josefin_Sans'] drop-shadow-lg mb-6">
            Audisea
          </h1>
          <p className="text-dark text-xl md:text-2xl lg:text-4xl font-['Josefin_Sans'] mb-3">
            Private tutoring by <span className="font-bold">passionate</span> people.
          </p>
          <p className="text-accent text-base md:text-lg mb-8">
            Empowering students and parents with personalized learning.
          </p>
          <button
            onClick={() => window.location.href = "/contact"}
            className="px-8 py-4 rounded-full border-2 border-primary bg-primary text-white text-lg md:text-xl lg:text-2xl font-['Josefin_Sans'] shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a8f7b] hover:border-[#7a8f7b] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const whyUsData = [
    {
      img: whyUs1,
      title: "Personalized",
      desc: "Tailored learning plans for every student.",
      elipseClass: "top-[-5px] right-[-5px]",
    },
    {
      img: whyUs2,
      title: "Expert Tutors",
      desc: "Learn from passionate, experienced educators.",
      elipseClass: "bottom-[-5px] right-[-5px]",
    },
    {
      img: whyUs3,
      title: "Proven Results",
      desc: "Track record of student success and satisfaction.",
      elipseClass: "top-[-5px] right-[-5px]",
    },
  ];
  return (
    <div className="w-screen bg-primary py-16 px-6 sm:px-20">
      <h1 className="text-offwhite text-4xl sm:text-5xl lg:text-5xl font-bold font-['Josefin_Sans'] text-center mb-10 drop-shadow-lg">
        Why Audisea?
      </h1>
      <div className="flex flex-wrap justify-evenly gap-10">
        {whyUsData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 min-w-[250px] relative">
            <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[271px] lg:h-[271px] bg-offwhite rounded-full flex items-center justify-center relative shadow-lg">
              <Image src={item.img} alt={item.title} className="w-full h-full rounded-full" />
              <Image
                src={whyUsElipse}
                alt="Elipse"
                className={`absolute ${item.elipseClass} w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]`}
              />
            </div>
            <h2 className="text-offwhite text-xl sm:text-2xl lg:text-4xl font-bold font-['Josefin_Sans'] mt-4 text-center">
              {item.title}
            </h2>
            <p className="text-offwhite text-base sm:text-lg mt-2 text-center max-w-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function Offerings() {
  return (
    <section className="w-full bg-[#FBF8F6] py-20 px-4 sm:px-10 lg:px-32 flex flex-col items-center">
      <h1 className="text-dark font-bold font-['Josefin_Sans'] text-4xl sm:text-5xl lg:text-6xl mb-4 text-center">Offerings</h1>
      <h3 className="text-dark font-['Josefin_Sans'] text-lg sm:text-2xl mb-10 text-center max-w-2xl">
        We offer all kinds of test preparation. You can be sure that we can make your child succeed.
      </h3>
      <div className="w-full flex flex-wrap justify-center gap-8 sm:gap-10">
        {offerings.map((offering, index) => (
          <div
            key={index}
            className="bg-offwhite rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-xs min-w-[260px] transition-transform hover:scale-105 border border-light"
          >
            <h2 className="text-primary text-2xl font-bold mb-2 text-center font-['Josefin_Sans']">{offering.title}</h2>
            <p className="text-dark text-base mb-4 text-center">{offering.description}</p>
            <button className="mt-auto px-6 py-2 rounded-full bg-primary text-white font-semibold text-base shadow hover:bg-[#7a8f7b] transition-colors">{offering.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
}


function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const getVisibleCount = () => {
      if (typeof window === 'undefined') return 1;
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };
    setVisibleCount(getVisibleCount());
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Always keep index in bounds
  useEffect(() => {
    if (index >= testimonials.length) {
      setIndex(0);
    }
  }, [visibleCount, testimonials.length]);

  // Helper to get the correct slice, wrapping if needed
  const getVisibleTestimonials = () => {
    if (testimonials.length <= visibleCount) return testimonials;
    let result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(testimonials[(index + i) % testimonials.length]);
    }
    return result;
  };

  const prevTestimonial = () => {
    if (testimonials.length <= visibleCount) return;
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextTestimonial = () => {
    if (testimonials.length <= visibleCount) return;
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="w-full bg-primary py-20 px-4 flex flex-col items-center border-t border-light">
      <h2 className="text-offwhite text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 font-['Josefin_Sans'] drop-shadow-lg">
        What Our Clients Say
      </h2>
      <div className="relative w-full max-w-7xl flex flex-col items-center">
        <div className="flex items-center justify-center w-full gap-4">
          {/* Left Button */}
          <button
            onClick={prevTestimonial}
            className="p-4 bg-offwhite border-2 border-primary rounded-full shadow hover:bg-primary hover:text-offwhite text-primary text-2xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offwhite"
            aria-label="Previous testimonials"
            disabled={testimonials.length <= visibleCount}
          >
            &#8592;
          </button>
          {/* Carousel */}
          <div className="relative w-full flex justify-center overflow-hidden">
            <div className="flex gap-8 transition-all duration-500 items-stretch">
              {getVisibleTestimonials().map((testimonial, idx) => (
                <div
                  key={idx}
                  className="w-full sm:w-[280px] md:w-[340px] pt-16 pb-8 px-8 bg-[#FBF8F6] border-primary/20 rounded-3xl shadow-xl flex flex-col items-center justify-between animate-fadeIn transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl relative"
                  style={{ height: 340, minHeight: 260, maxHeight: 360 }}
                >

                  <div className="flex-1 flex flex-col justify-center w-full mt-4">
                    <p className="text-dark text-xl font-semibold mb-4 text-center italic line-clamp-5">"{testimonial.quote}"</p>
                  </div>
                  <div className="w-full flex flex-col items-center mt-4">
                    <div className="w-10 h-1 bg-primary rounded-full mb-3" />
                    <div className="text-primary font-bold text-base mb-1">{testimonial.name}</div>
                    <div className="text-accent text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Button */}
          <button
            onClick={nextTestimonial}
            className="p-4 bg-offwhite border-2 border-primary rounded-full shadow hover:bg-primary hover:text-offwhite text-primary text-2xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offwhite"
            aria-label="Next testimonials"
            disabled={testimonials.length <= visibleCount}
          >
            &#8594;
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s;
        }
      `}</style>
    </section>
  );
}



function Contact() {
  return (
    <div className="w-full h-auto relative overflow-hidden bg-offwhite py-16 px-10 sm:px-40">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left text-dark text-4xl sm:text-5xl lg:text-6xl font-bold font-['Josefin_Sans'] mb-8 sm:mb-0">
          Want to learn more?
          <div className="mt-4">
            <button
              onClick={() => window.location.href = "/contact"}
              className="bg-primary text-white text-lg sm:text-xl px-6 py-3 rounded-lg transition border-2 border-transparent hover:bg-[#7a8f7b] hover:text-white hover:border-[#7a8f7b]"
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
