
import { Link } from "react-router-dom";
import { leaf, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui-components";

export const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <leaf className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="text-lg font-medium">Carbon Connect</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Connecting carbon credit buyers and sellers to build a sustainable future.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links columns */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/buy-credits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Buy Credits
                </Link>
              </li>
              <li>
                <Link to="/sell-credits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sell Credits
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Carbon Calculator
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Education
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-base">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit" variant="default" size="sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2023 Carbon Connect. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
