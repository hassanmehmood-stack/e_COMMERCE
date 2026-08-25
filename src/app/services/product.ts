import { Injectable } from '@angular/core';
import { 
  addDoc, 
  collection, 
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

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

  async getProducts(): Promise<Product[]> {

    const snapshot = await getDocs(
      collection(db, 'products')
    );
    return snapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data()

    } as Product));
  }

  async getProduct(id: string): Promise<Product | null> {
    const productSnapshot = await getDoc(doc(db, 'products', id));

    if (!productSnapshot.exists()) {
      return null;
    }

    return {
      id: productSnapshot.id,
      ...productSnapshot.data()
    } as Product;
  }

  async updateProduct(id: string, product: Omit<Product, 'id'>): Promise<void> {
    await updateDoc(doc(db, 'products', id), product);
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id));
  }


}