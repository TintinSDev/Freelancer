// import { galada } from "@/lib/fonts";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black py-5">
      <div className="container max-auto">
        <div className="lg:flex justify-between lg:text-left text-center font-semibold">
          <p>
            Copyright © {new Date().getFullYear()}, <Link href={"/"} className={`transition duration-500 text-bg black`}>Martin Maina.</Link> All Rights Reserved
          </p>
          {/* <div>
            <ul className="lg:flex hidden space-x-5">
              <li>
                <Link
                  href="#about"
                  className="transition duration-500 hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="transition duration-500 hover:text-primary"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition duration-500 hover:text-primary"
                >
                  Resume
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition duration-500 hover:text-primary"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition duration-500 hover:text-primary"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="transition duration-500 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
}