# CommunityX 🏢

> **A comprehensive, modern, and smart community/society management system.**

CommunityX is a full-stack web application designed to streamline the administration and daily operations of housing societies and residential communities. Built with a modern tech stack, it provides an intuitive interface for managing residents, tracking bills, resolving complaints, broadcasting notices, and logging visitors.

## 🌟 Features

- **Dashboard & Overview:** Get a birds-eye view of your community's vital statistics.
- **Resident Management:** Efficiently onboard, manage, and maintain resident profiles.
- **Billing & Payments:** Generate, track, and manage utility and maintenance bills.
- **Complaint Resolution:** A streamlined ticketing system for residents to raise and track issues.
- **Notice Board:** Broadcast important announcements and notices to all society members.
- **Visitor Logs:** Enhance security by tracking visitor entries and exits in real-time.
- **AI Integration:** Smart insights and AI-powered assistance (via AI Controller).

## 💻 Tech Stack

### Frontend
- **React 19 & Vite:** Fast, modern, and optimized frontend architecture.
- **Tailwind CSS 4:** Utility-first CSS framework for a responsive, sleek design.
- **Radix UI & Lucide Icons:** Accessible, high-quality, and unstyled components for a premium user interface.
- **React Router:** Seamless client-side routing.

### Backend
- **Node.js & Express:** Robust and scalable server-side framework.
- **MongoDB & Mongoose:** Flexible and powerful NoSQL database for data persistence.
- **JWT Authentication:** Secure, token-based authentication and authorization.
- **Cloudinary & Multer:** Efficient handling, uploading, and storage of media and documents.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- Cloudinary Account (for media uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adeel-151/communityX.git
   cd communityX
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory with the following variables:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   *Start the frontend development server:*
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
CommunityX/
├── backend/                  # Express server & APIs
│   ├── src/
│   │   ├── controllers/      # Route controllers (Auth, Bills, Residents, etc.)
│   │   ├── models/           # Mongoose schemas (User, Society, Bill, etc.)
│   │   ├── middlewares/      # Custom middlewares (Auth, Upload, Error handling)
│   │   └── server.js         # Backend entry point
│   └── package.json
└── frontend/                 # React application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Application views (Overview, Login, Bills, etc.)
    │   └── App.jsx           # Frontend entry point
    ├── vite.config.js
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/adeel-151/communityX/issues).

## 📝 License

This project is licensed under the ISC License.
