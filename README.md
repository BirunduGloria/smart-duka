# Smart POS System

A modern Point of Sale (POS) web application built with Next.js. This app features inventory management, user authentication, and a responsive, user-friendly interface.
Designed for small retail setups and duka owners, it supports inventory tracking, role-based access control, and admin-exclusive functionalities.

## Features
- User authentication (login/logout)
- Inventory management (add, edit, inline edit, and view products)
- Responsive design with card-like and table layouts
- Product search and filtering

## Preview
<img width="1600" height="1000" alt="image" src="https://github.com/user-attachments/assets/0a3ef35b-87ec-4f30-a902-0fd4053fe396" />

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn
- Git

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/BirunduGloria/smart-duka
   cd smart-duka
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App
```bash
npm run dev
# or
yarn dev
```
View app on vercel

### Project Structure
📦app/
 ┣ 📄 layout.js         # Root layout shared across routes
 ┣ 📄 page.js           # Landing page
 ┣ 📁 components/       # UI components like ProductCard, InventoryList
 ┣ 📁 context/          # UserContext and Provider logic
 ┣ 📁 data/             # Static product data in JSON format
 ┣ 📁 inventory/        # Admin-only inventory views
📦public/               # Static assets (images, icons)

### Inventory Data
- Product data is stored in `public/data/products.json`.
- For demo purposes, changes to inventory are in-memory only (not persisted to disk).

### Admin Access
- Only users with the `admin` role can access inventory management features.
- You can adjust user roles in the context or authentication logic as needed.

### Author
1. Gloria Birindu
2. Peter Munyambu
3. Gideon Kimaiyo
4. Ashington Munene

## License
[MIT](LICENSE)
