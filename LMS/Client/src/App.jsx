import Login from '../src/pages/login.jsx'
import './App.css'
import Herosection from './pages/students/Herosection.jsx'
import MainLayout from './Layout/MainLayout.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Courses from './pages/students/Courses.jsx'
import MyLearning from './pages/students/MyLearning.jsx'
import Profile from './pages/students/Profile.jsx'
import SideBar from './pages/admin/SideBar.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import CourseTable from './pages/admin/course/CourseTable.jsx'
import Addcourse from './pages/admin/course/AddCourse.jsx'
import EditCourse from './pages/admin/course/EditCourse.jsx'
import CreateLeture from './pages/admin/lecture/CreateLeture.jsx'
import EditLecture from './pages/admin/lecture/EditLecture.jsx'
import CourseDeatils from './pages/students/CourseDeatils.jsx'
import CourseProgress from './pages/students/CourseProgress.jsx'
import Searchpage from './pages/students/Searchpage.jsx'
import { AdminRoutes, AuthenticatedUser, ProtectedRoutes } from './components/ProtectedRoutes.jsx'
import { PurchaseCourseProtectedRoute } from './components/PurchaseCourseProtectedRoute.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'


function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element:
            <>
              <ProtectedRoutes>
                <Herosection />
                {/* Courses */}
                <Courses />
              </ProtectedRoutes>
            </>
        },
        {
          path: "login",
          element: <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        },
        {
          path: "my-learning",
          element: <ProtectedRoutes>
            <MyLearning />
          </ProtectedRoutes>
        },
        {
          path: "profile",
          element: <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        },
        {
          path: "course/search",
          element: <ProtectedRoutes>
            <Searchpage />
          </ProtectedRoutes>
        },
        {
          path: "course-detail/:courseId",
          element: <ProtectedRoutes>
            <CourseDeatils />
          </ProtectedRoutes>
        },
        {
          path: "course-progress/:courseId",
          element: <ProtectedRoutes>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoutes>
        },
        // Admin routes start from here
        {
          path: "admin",
          element: <AdminRoutes>
            <SideBar />
          </AdminRoutes>,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />
            },
            {
              path: "course",
              element: <CourseTable />
            },
            {
              path: "course/create",
              element: <Addcourse />
            },
            {
              path: "course/:courseId",
              element: <EditCourse />
            },
            {
              path: "course/:courseId/lecture",
              element: <CreateLeture />
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />
            },
          ]
        }
      ]
    }
  ])
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
