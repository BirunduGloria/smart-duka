# Smart-Duka

A modern, responsive Point of Sale (POS) system built with Next.js, featuring a beautiful UI and comprehensive inventory management.

## Features

### **Home Page**
- **Welcome Section**: Flashy animated header with currency selector
- **Featured Products**: Responsive grid layout with product cards
- **Smart Stock Alerts**: Real-time low stock notifications
- **Expiring Soon**: Items expiring within a week
- **Currency Conversion**: Support for KES and USD

### **Product Management**
- **Product Cards**: Beautiful, responsive product display
- **Stock Status**: Color-coded stock indicators
- **Discount Badges**: Visual discount indicators
- **Add to Cart**: Seamless cart integration
- **Quantity Management**: Add/remove items with stock validation

### **Shopping Cart**
- **Real-time Updates**: Cart syncs across all pages
- **Quantity Controls**: Increase/decrease item quantities
- **Price Calculation**: Automatic total calculation
- **Currency Support**: Multi-currency pricing
- **Persistent Storage**: Cart data survives page refreshes

### **Authentication**
- **User Login**: Secure authentication system
- **User Registration**: Sign up functionality
- **Role-based Access**: Admin and user roles

### **Inventory Management**
- **Product Inventory**: Complete product management
- **Stock Tracking**: Real-time stock monitoring
- **Admin Dashboard**: Inventory control panel

## Live Demo

**Deployed on Vercel**: [Smart-Duka Live](https://smart-duka.vercel.app)

## Tech Stack

- **Framework**: Next.js 15.4.3
- **Language**: JavaScript (ES6+)
- **Styling**: Inline CSS with custom animations
- **State Management**: React Hooks + localStorage
- **Deployment**: Vercel
- **Authentication**: Custom user context

## Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Grid Layout**: Responsive product grid
- **Touch Friendly**: Optimized for mobile interactions
- **Modern UI**: Clean, professional design

## UI Features

- **Gradient Backgrounds**: Beautiful color schemes
- **Hover Effects**: Interactive elements
- **Smooth Animations**: CSS transitions and keyframes
- **Professional Typography**: Clear, readable text
- **Color-coded Status**: Visual indicators for stock levels

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/smart-duka.git
cd smart-duka
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
smart-duka/
├── app/
│   ├── components/
│   │   ├── ProductCard.js      # Product display component
│   │   ├── NavBar.js          # Navigation component
│   │   ├── Footer.js          # Footer component
│   │   └── Auth/              # Authentication components
│   ├── context/
│   │   └── UserContext.js     # User state management
│   ├── cart/
│   │   └── page.js            # Shopping cart page
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Home page
├── public/
│   └── data/
│       └── products.json      # Product data
└── README.md
```

## Key Features

### **Smart Stock Management**
- Automatic low stock alerts
- Expiry date tracking
- Real-time inventory updates

### **Multi-Currency Support**
- KES (Kenyan Shillings)
- USD (US Dollars)
- Real-time conversion rates

### **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface

### **Cart Synchronization**
- Real-time cart updates
- Persistent storage
- Cross-page synchronization

## Deployment

This application is deployed on **Vercel** for optimal performance and reliability.

**Live URL**: [https://smart-duka.vercel.app](https://smart-duka.vercel.app)

### Deployment Features
- **Automatic Deployments**: Connected to GitHub repository
- **Global CDN**: Fast loading worldwide
- **SSL Certificate**: Secure HTTPS connection
- **Performance Optimization**: Built-in Next.js optimizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Unsplash** for product images
- **All Contributors** who helped build this project

---

**Built with love for modern retail management**
