# Sistema de Asistencias de Personal - Frontend

Sistema web para el control y gestión de asistencias del personal de empresa, desarrollado con Angular 18.

![Angular](https://img.shields.io/badge/Angular-18.2.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue)
![Material Design](https://img.shields.io/badge/Angular%20Material-18.2.14-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-cyan)

##  Descripción del proyecto

Aplicación frontend desarrollada en Angular que permite gestionar el registro de entrada y salida del personal de la empresa. El sistema incluye autenticación de usuarios, registro de asistencias en tiempo real, visualización de reportes y administración de empleados.

##  Características

-  **Sistema de autenticación** con JWT
-  **Gestión de usuarios** y roles
-  **Registro de asistencias** en tiempo real
-  **Dashboard** con estadísticas
-  **Reportes de asistencias**
-  **Reloj digital** integrado
-  **Diseño responsivo**
-  **Material Design** con TailwindCSS

## 🛠️ Tecnologías Utilizadas

- **Framework:** Angular 18.2.0
- **Lenguaje:** TypeScript
- **UI Components:** Angular Material 18.2.14
- **Estilos:** TailwindCSS 3.4.17, SCSS
- **Estado:** RxJS 7.8.0
- **HTTP Client:** Angular HttpClient
- **Testing:** Jasmine & Karma

##  Instalación

### Requisitos del sistema local

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI 18.2.14

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/juandavidmontenegro/Asistencia-Personal-Empresa-Frontend.git
cd Asistencia-Personal-Empresa-Frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Editar el archivo `src/environments/dev.environment.ts`:
```typescript
export const environment = {
  production: false,
  UrlApi: 'https://asistencias-personal-empresa-backend-1.onrender.com/api'
};
```

4. **Ejecutar la aplicación**
```bash
ng s --open
```

La aplicación estará disponible en `http://localhost:4200/`

## Ingresar al sistemas de Asistencias
### login Credenciales
```bash
davidmontenegro-b@hotmail.com
```
```bash
Pasw12.$
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── auth-interceptor/    # Interceptores HTTP
│   │   ├── auth-interface/      # Interfaces de auth
│   │   ├── auth-services/       # Servicios de autenticación
│   │   ├── guard/              # Guards de rutas
│   │   └── layout/             # Layout de auth
│   ├── interface/              # Interfaces globales
│   ├── pages/                  # Páginas principales
│   │   ├── asistencia/         # Gestión de asistencias
│   │   ├── dashboard/          # Panel principal
│   │   ├── home/              # Página de inicio
│   │   ├── login/             # Página de login
│   │   ├── register/          # Registro de usuarios
│   │   ├── tabla/             # Tablas de datos
│   │   ├── modal/             # Componentes modales
│   │   ├── nav/               # Navegación
│   │   └── hora-fecha/        # Componentes de tiempo
│   ├── service/               # Servicios globales
│   └── environments/          # Variables de entorno
├── public/                    # Archivos públicos
└── styles/                    # Estilos globales
```

##  Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

- **Login:** `/auth/login`
- **Guards:** Protección de rutas según roles
- **Interceptores:** Manejo automático de tokens
- **Refresh Token:** Renovación automática de sesiones

## Funcionalidades Principales

###  Dashboard
- Conteo de Asistencias de empleados por empresas y visitantes a la empresa

###  Control de Asistencias
- Registro de entrada/salida
- Reloj en tiempo real
- Historial de registros
### Gestión de Empleados
- Registro de empleados
## 🔧 Configuración

### Environment Variables
```typescript
// src/environments/dev.environment.ts
export const environment = {
  production: true,
  UrlApi: 'https://asistencias-personal-empresa-backend-1.onrender.com/api'
};
```

### Angular Material Theme
El proyecto utiliza un tema personalizado configurado en `src/themem3-theme.scss`

### TailwindCSS
Configuración personalizada en `tailwind.config.js` para componentes específicos.


## Autor

**Juan David Montenegro**
- GitHub: [@juandavidmontenegro](https://github.com/juandavidmontenegro)
- Correo:  [davidmontenegro-b@hotmail.com]


**¡Si te gusta el proyecto, dale una estrella!**
