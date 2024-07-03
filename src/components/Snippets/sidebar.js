import left_arrow from "../../assets/left_arrow.svg";
import logo1 from "../../assets/images/logo1.png";
import "./sidebar.css";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <img
        src={left_arrow}
        alt="close"
        className={`cursor-pointer fixed z-30 top-[35%] ${
          isOpen ? "arrowPositionOpen" : "arrowPositionClose rotate-180"
        } hidden bigTablet:block`}
        width={35}
        onClick={() => setIsOpen(!isOpen)}
      />
      <div
        className={`fixed top-0 z-20 bg-themeGray-900 border-r border-b border-themeGray-600 ${
          isOpen ? "sidebarOpen" : "sidebarClose"
        } overflow-hidden rounded-br-md flex-col items-center py-5 justify-between h-[100vh] hidden bigTablet:flex`}
      >
        <img src={logo1} alt="logo" width={45} />
        <div>
          <p className="font-bold text-3xl -rotate-90 mb-[120px]"> DLEX</p>
          <p className="font-bold text-3xl -rotate-90 mb-12">ELEMENT</p>&nbsp;
          {/* <br/> */}
        </div>
      </div>
    </>
  );
};