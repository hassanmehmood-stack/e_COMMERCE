import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Products } from './features/products/products';
import { LoginComponent} from './features/auth/login/login';
import { SignupComponent} from './features/auth/signup/signup';
import { adminGuard } from './guards/admin-guard';
import { Admin } from './features/admin/admin';
import { AddProduct } from './features/admin/add-product/add-product';


export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    component: Products,
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'signup',
    component : SignupComponent
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/add-product',
    component: AddProduct
  }
];


