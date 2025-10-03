# RasayanaBio Frontend

A modern React e-commerce application for RasayanaBio, featuring premium Ayurvedic supplements and natural wellness products.

## Features

- **Product Catalog**: Browse and search through a comprehensive range of natural supplements
- **Shopping Cart**: Add products to cart with quantity management
- **User Authentication**: Secure login and registration system
- **Order Management**: Track orders and view order history
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern features
- **Backend Integration**: RESTful API integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- RasayanaBio Backend API running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RasayanaBio-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Site footer
│   └── ProductCard.js  # Product display card
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Products.js     # Product listing
│   ├── ProductDetail.js # Product details
│   ├── Cart.js         # Shopping cart
│   ├── Checkout.js     # Checkout process
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── Profile.js      # User profile
│   ├── Orders.js       # Order history
│   ├── OrderDetail.js  # Order details
│   ├── About.js        # About page
│   └── Contact.js      # Contact page
├── App.js              # Main application component
├── App.css             # Global styles
├── index.js            # Application entry point
└── index.css           # Base styles
```

## API Integration

The frontend communicates with the RasayanaBio backend API for:

- **Authentication**: User login/registration
- **Products**: Product catalog and details
- **Cart**: Shopping cart management
- **Orders**: Order creation and tracking
- **Contact**: Contact form submissions

## Features Overview

### Product Catalog
- Browse products by category
- Search functionality
- Product filtering
- Detailed product pages with reviews

### Shopping Cart
- Add/remove products
- Quantity management
- Persistent cart state
- Real-time price calculation

### User Authentication
- Secure login/registration
- JWT token management
- Protected routes
- User profile management

### Order Management
- Order creation and tracking
- Order history
- Detailed order views
- Payment status tracking

## Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Responsive design principles
- Smooth transitions and animations

## Environment Configuration

The application is configured to proxy API requests to `http://localhost:5000` by default. To change this, update the `proxy` field in `package.json`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@rasayanabio.com or visit our contact page.
