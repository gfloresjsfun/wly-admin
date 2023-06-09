import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// render - sample page
import { Navigate } from 'react-router';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const Shows = Loadable(lazy(() => import('pages/shows')));
const Albums = Loadable(lazy(() => import('pages/albums')));
const Suggestions = Loadable(lazy(() => import('pages/suggestions')));
const Collections = Loadable(lazy(() => import('pages/collections')));
const PainPoints = Loadable(lazy(() => import('pages/painPoints')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'shows',
          element: <Shows />,
          children: [
            {
              path: 'create',
              element: <Shows />
            },
            {
              path: ':id/edit',
              element: <Shows />
            }
          ]
        },
        {
          path: 'albums',
          element: <Albums />,
          children: [
            {
              path: 'create',
              element: <Albums />
            },
            {
              path: ':id/edit',
              element: <Albums />
            }
          ]
        },
        {
          path: 'suggestions',
          element: <Suggestions />,
          children: [
            {
              path: 'create',
              element: <Suggestions />
            },
            {
              path: ':id/edit',
              element: <Suggestions />
            }
          ]
        },
        {
          path: 'collections',
          element: <Collections />,
          children: [
            {
              path: 'create',
              element: <Collections />
            },
            {
              path: ':id/edit',
              element: <Collections />
            }
          ]
        },
        {
          path: 'pain-points',
          element: <PainPoints />,
          children: [
            {
              path: 'create',
              element: <PainPoints />
            },
            {
              path: ':id/edit',
              element: <PainPoints />
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/maintenance/404" />
    }
  ]
};

export default MainRoutes;
