const Footer = () => {
    return (
      <footer className="bg-muted/30 border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 SmartPark. All rights reserved.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-medium text-foreground mb-1">
                Group 48
              </p>
              <p className="text-sm text-muted-foreground">
                Prijith, Naveen, Navya, Jahnavi, Jasper
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;