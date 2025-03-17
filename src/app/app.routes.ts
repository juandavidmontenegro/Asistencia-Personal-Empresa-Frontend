import { Routes } from '@angular/router';
import { guardRoleGuard } from './auth/guard/guard-role.guard';
import { AuthGuard } from './auth/guard/preven.guard';

export const routes: Routes = [
  
     // Rutas de autenticación (Login)
     {
        path: 'auth',
      canActivate:[AuthGuard],
        loadComponent:() =>
            import ('./auth/layout/layout.component').then((m) => m.LayoutComponent),
                children : [
                    {
                        path: 'login',
                        loadComponent: () =>
                            import ('./pages/login/login.component').then((m) => m.LoginComponent),
                    },
                    {
                        path: '**',
                        redirectTo: 'login',
                        pathMatch: 'full'
                    }
                 ], 
                
    },
 
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },

    // Ruta del dashboard
    {
        path : 'dashboard',
        canActivate: [guardRoleGuard],
        loadComponent: () =>
            import('../app/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        children: [
            {
                path:'home',
                loadComponent:()=> import ('../app/pages/home/home.component').then((m)=> m.HomeComponent)
            },
            {
                path:'registerperson',
                loadComponent:()=> import ('../app/pages/register/register.component').then((m)=> m.RegisterComponent)
            },
            {
                path:'asistencias',
                loadComponent:()=> import ('../app/pages/asistencia/asistencia.component').then((m)=> m.AsistenciaComponent)
            }

        ]
    },
    

    // Si la ruta no existe, redirigir al login
    {
        path: '**',
        redirectTo: 'auth' , 
        pathMatch: 'full'
    }
    


];

