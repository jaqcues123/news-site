import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 mt-auto">
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            {/* Always show the dark-bg logo since the footer is always dark */}
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/newsfleetblack.png"
                alt="New England Wrecker Sales"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Custom NRC-built wreckers, rollbacks, and rotators. Serving the towing
              and recovery industry throughout New England and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/inventory", label: "Inventory" },
                { href: "/contact", label: "Contact Sales" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#FFC700] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+16036587171"
                  className="hover:text-[#FFC700] transition-colors duration-150"
                >
                  (603) 658-7171
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales@netruckcenter.com"
                  className="hover:text-[#FFC700] transition-colors duration-150"
                >
                  sales@netruckcenter.com
                </a>
              </li>
              <li className="leading-relaxed">
                156 Epping Road<br />
                Exeter, NH 03833 
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>
            &copy; {new Date().getFullYear()} New England Wrecker Sales. All rights reserved.
          </p>
          <p>
            Part of{" "}
            <a
              href="https://netcfleetservices.com"
              className="text-[#3A6EA5] hover:text-[#FFC700] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              NETC Fleet Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
