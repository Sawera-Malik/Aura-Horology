const Footer = () => {
  const CurrentYear= new Date().getFullYear();
  return (
    <footer className="bg-primary text-text mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Aura Horology</h3>
            <p className="text-text/70">
              Your one-stop shop for all your needs. Quality products at great prices.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-text/70">
              <li>
                <a href="/" className="hover:text-accent transition-colors">Home</a>
              </li>
              <li>
                <a href="/products" className="hover:text-accent transition-colors">Products</a>
              </li>
              <li>
                <a href="/cart" className="hover:text-accent transition-colors">Cart</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-text/70">
              Email: support@horology.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-card mt-8 pt-8 text-center text-text/70">
          <p>&copy; {CurrentYear} Aura Horology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

