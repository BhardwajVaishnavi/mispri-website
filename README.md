# Bakery Shop E-commerce Website

This is the customer-facing e-commerce website for Bakery Shop, built with Next.js, Tailwind CSS, and Prisma.

## Features

- Browse products by category
- View product details
- Add products to cart
- Checkout process
- User authentication
- Responsive design for mobile and desktop
- Contact form
- About page
- User account management

## Pages Implemented

- **Home Page**: Featured products, categories, and promotional sections
- **Products Page**: Browse all products with filtering by category
- **Category Pages**: View products by specific category
- **Product Detail Page**: Detailed product information with related products
- **Cart Page**: View and manage shopping cart
- **Checkout Page**: Complete purchase with shipping and payment information
- **Login/Register Page**: User authentication
- **Account Page**: User profile, orders, wishlist, and addresses
- **Contact Page**: Contact form and store information
- **About Page**: Company information and team

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database (shared with the admin panel)

### Installation

1. Clone the repository
2. Navigate to the website directory:
   ```bash
   cd website
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the website directory with the following content:
   ```
   NEXT_PUBLIC_API_URL="https://mispri24.vercel.app/api"
   NEXT_PUBLIC_APP_URL="http://localhost:3001"
   NEXT_PUBLIC_ADMIN_URL="https://mispri24.vercel.app"
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3001](http://localhost:3001) in your browser

## Deployment

### Deploying to Vercel

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Configure the project:
   - Root Directory: `/website` (the website subdirectory)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. Add environment variables from your website's `.env` file
5. Set the custom domain to `www.yourdomain.com`

### DNS Configuration

Add these records to your domain's DNS settings:

For www.yourdomain.com:
```
Type: A
Name: www
Value: <Vercel IP address>
```

## Project Structure

```
/website
├── /src                      # Source code
│   ├── /app                  # Next.js app directory
│   │   ├── /page.tsx         # Homepage
│   │   ├── /category         # Category pages
│   │   ├── /product          # Product pages
│   │   ├── /cart             # Shopping cart
│   │   ├── /checkout         # Checkout process
│   │   ├── /account          # User account
│   │   ├── /login            # Authentication
│   │   ├── /about            # About page
│   │   └── /contact          # Contact page
│   ├── /components           # React components
│   │   ├── /Header.tsx       # Header component
│   │   ├── /Footer.tsx       # Footer component
│   │   ├── /ProductCard.tsx  # Product card component
│   │   └── /...              # Other components
│   └── /lib                  # Utility functions
│       └── /api.ts           # API client functions
├── /public                   # Static assets
└── /...                      # Configuration files
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Admin Panel API](https://mispri24.vercel.app/api) - Backend integration
- [NeonDB PostgreSQL](https://neon.tech/) - Database (via admin panel)

## Future Enhancements

- Implement authentication with NextAuth.js
- Add product search functionality
- Implement wishlist functionality
- Add product reviews and ratings
- Integrate payment gateways
- Implement order tracking
- Add product filtering and sorting options
- Implement internationalization for multiple languages

## License

This project is licensed under the MIT License.
