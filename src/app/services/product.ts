import { Injectable } from '@angular/core';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../core/firebase.config';
import { Product } from '../models/products.type';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {

    const productRef = await addDoc(
      collection(db, 'products'),
      product
    );

    return productRef.id;
  }
}