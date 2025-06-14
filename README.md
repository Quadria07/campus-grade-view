
# Check My Grade - Academic Grade Management System

A comprehensive web application for managing academic grades, built with React, TypeScript, and Tailwind CSS. This system allows lecturers to manage students and results while providing students with easy access to their academic records.

## 🚀 Features

### For Lecturers
- **Student Management**: Add, edit, and manage student records
- **Course Management**: Create and manage course catalog
- **Result Management**: Upload grades manually or via CSV bulk upload
- **Automatic Grade Calculation**: Converts scores to letter grades automatically
- **Report Generation**: Generate and export student transcripts
- **Dashboard Analytics**: Overview of students, courses, and recent activities

### For Students
- **Academic Results**: View grades filtered by semester and session
- **Profile Management**: Update personal information (editable fields: phone, email)
- **Transcript Download**: Export academic records as PDF
- **GPA Tracking**: Real-time CGPA and semester GPA calculations
- **Progress Monitoring**: Track academic progress and completion status

### General Features
- **Secure Authentication**: Role-based access control for lecturers and students
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Real-time Updates**: Instant feedback and notifications
- **Data Validation**: Input validation and error handling
- **Print Support**: Print-friendly result layouts

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Context API
- **Routing**: React Router v6
- **HTTP Client**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Authentication**: Supabase Auth (ready for integration)
- **Database**: Supabase (ready for integration)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd check-my-grade
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── lecturer/       # Lecturer-specific components
│   └── student/        # Student-specific components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── lib/               # Utility functions
└── types/             # TypeScript type definitions

public/                # Static assets
docs/                  # Documentation
```

## 🔐 Authentication & Roles

The system supports two user roles:

### Lecturer Access
- **Login**: Use any email and password (demo mode)
- **Features**: Full access to student and course management
- **Dashboard**: `/lecturer-dashboard`

### Student Access
- **Login**: Use any matric number as username with any password (demo mode)
- **Features**: View results and manage profile
- **Dashboard**: `/student-dashboard`

## 📊 Database Schema (Supabase Ready)

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- role (Enum: 'lecturer', 'student')
- created_at (Timestamp)
```

### Students Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- matric_number (String, Unique)
- name (String)
- department (String)
- level (String)
- phone (String)
```

### Courses Table
```sql
- id (UUID, Primary Key)
- code (String, Unique)
- title (String)
- credit_units (Integer)
- department (String)
- level (String)
- semester (String)
```

### Results Table
```sql
- id (UUID, Primary Key)
- student_id (UUID, Foreign Key)
- course_id (UUID, Foreign Key)
- score (Integer)
- grade (String)
- semester (String)
- session (String)
- created_at (Timestamp)
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations (SQL schema above)
3. Configure authentication settings
4. Add environment variables to your `.env` file

## 📱 API Integration

The application is designed to work with Supabase backend:

- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **File Storage**: Supabase Storage (for CSV uploads)
- **Real-time**: Supabase Realtime (for live updates)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Automatic theme detection
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 📤 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy build folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔍 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📝 Development Guide

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement feature with tests
3. Update documentation
4. Submit pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Add loading and error states
- Write unit tests for components

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@checkmygrade.edu
- Documentation: [docs/](docs/)
- Issues: GitHub Issues

## 🚀 Roadmap

- [ ] Supabase integration
- [ ] CSV bulk upload functionality
- [ ] PDF transcript generation
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 📸 Screenshots

### Home Page
Clean, professional landing page with role-based login options.

### Lecturer Dashboard
Comprehensive management interface with statistics and quick actions.

### Student Dashboard
Student-focused interface showing academic progress and results.

### Results Management
Intuitive interface for managing and uploading student results.

---

**Built with ❤️ for educational excellence**
