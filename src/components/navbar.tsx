import logo from "../../public/logo.png"
export default function Navbar()
{
  return(
    <>
      <nav className="w-full flex justify-between items-center p-6 pt-10 bg-[#FBF8F6]">
        <div className="flex items-center w-7">
          <img src={logo.src} className = "ml-[50px]"/>
        </div>
        <div className="flex gap-8 mr-[10px]">
          <div className= "text-2xl text-[#494a4a] font-['Josefin_Sans'] ">About</div>
          <div className= "text-2xl text-[#494a4a] font-['Josefin_Sans'] ">Contact</div>
        </div>
      </nav>
    </>
  )
}
