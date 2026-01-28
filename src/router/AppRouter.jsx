import { lazy, useEffect } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';
import RoutesWrapper from './routes';  // Import your updated RoutesWrapper

export default function AppRouter() {
  let location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { app } = appContextAction;

  const routesList = RoutesWrapper();  // Use the RoutesWrapper to get the dynamic routes list

  function getAppNameByPath(path) {
    // Iterate over all routes and return the key (app) for the matching path
    for (let key in routesList) {
      for (let i = 0; i < routesList[key].length; i++) {
        if (routesList[key][i].path === path) {
          return key;
        }
      }
    }
    // Return 'default' app if the path is not found
    return 'default';
  }

  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [location]);

  let element = useRoutes(routesList);  // Get the final routing element using `useRoutes`

  return element;  // Render the routed elements
}
