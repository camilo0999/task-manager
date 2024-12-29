export const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/unauthorized', element: <Unauthorized /> },
    { path: '*', element: <NotFound /> },
  ];
  
  export const privateRoutes = [
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute requiredRole="user">
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/get-task/:id',
      element: (
        <ProtectedRoute requiredRole="user">
          <GetTask />
        </ProtectedRoute>
      ),
    }
  ];
  
  export const routes = [...publicRoutes, ...privateRoutes];  