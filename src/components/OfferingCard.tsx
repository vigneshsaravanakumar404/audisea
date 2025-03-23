interface OfferingCardProps {
  title: string;
  buttonText: string;
  description: string;
}

export default function OfferingCard({ title, buttonText, description }: OfferingCardProps) {
  return (
    <div className="w-full sm:w-[32%] md:w-[30%] lg:w-[30%] bg-[#D9D9D9] p-6 sm:p-8 flex flex-col rounded-lg shadow-[0px_0px_16px_-2px_rgba(0,0,0,0.30)] font-['Josefin_Sans']">
      <h1 className="text-[36px] text-[#494A4A] font-bold text-center">{title}</h1>
      <a
        href={`/contact?subject=${encodeURIComponent(title)}`}
        className="p-[10px] text-center bg-white mt-[10px] mb-[20px] rounded-lg text-black block border-2 border-black transition-all duration-300 ease-in-out hover:bg-[#FBF8F6] hover:scale-105"
      >
        {buttonText}
      </a>
      <p className="text-[#494A4A] font-semibold">
        {description}
      </p>
    </div>
  );
}
