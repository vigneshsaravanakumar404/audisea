import Image from "next/image";
import home1 from "../../public/home1.svg";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#FBF8F6] overflow-hidden">

      <main className="flex flex-col md:flex-row items-center justify-center flex-1 p-6">
        <div className="relative">
          <Image src={home1} alt="home1" className="w-100 h-100" />
        </div>
        <div className="text-center md:text-right md:ml-16">
          <h1 className="text-[#96aa97] text-6xl mt-[30px] lg:mt-[0px] md:text-9xl font-bold font-['Josefin_Sans']">Audisea</h1>
          <p className="mt-4 text-[#494a4a] text-2xl md:text-4xl font-['Josefin_Sans']">
            Private tutoring by <span className="font-bold">passionate</span> people.
          </p>
          <button className="mt-4 md:mt-8 px-6 py-3 rounded-full border border-[#2c2c2c] text-[#494a4a] text-xl md:text-2xl font-['Josefin_Sans']">
            Get Started Now
          </button>
        </div>
      </main>

    </div>

  );
}
