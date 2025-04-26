import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-5 box-border">
        <div className="flex justify-center gap-8 md:gap-10 mb-5 flex-wrap">
          <Link className="font-bold text-base" href="#">
            FaQ
          </Link>
          <Link className="font-bold text-base" href="#">
            About Us
          </Link>
          <Link className="font-bold text-base" href="#">
            News
          </Link>
          <Link className="font-bold text-base" href="#">
            Projects
          </Link>
          <Link className="font-bold text-base" href="#">
            Profile
          </Link>
        </div>

        <div className="flex gap-4 sm:gap-0 items-start sm:justify-between sm:items-center mb-4 flex-col sm:flex-row">
          <div>
            <h2 className="font-bold text-lg">Contact Us</h2>
            <p>Email: support@renovestua.com</p>
            <p>Phone: +380 (XX) XXX-XX-XX</p>
            <p>Address: Kyiv, Ukraine</p>
          </div>

          <div>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Investor Disclaimer</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p>Renovest UA 2025</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
