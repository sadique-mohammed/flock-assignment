import { Link } from "react-router-dom";
import { Heart, Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            <span className="font-bold text-lg">WishList</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/wishlists" className="hover:text-primary transition-colors">
              My Wishlists
            </Link>
            <a
              href="mailto:sadique.college@gmail.com"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </a>
            <a
              href="https://github.com/sadique-mohammed/flock-assignment"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} sadique. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
