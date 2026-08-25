import { Injectable } from '@angular/core';
import {UserData} from '../models/users.type';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

import { BehaviorSubject } from 'rxjs';
import { auth, db } from '../core/firebase.config';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private currentUserSubject =
    new BehaviorSubject<UserData | null>(null); 

  currentUser$ =
    this.currentUserSubject.asObservable();


  private authReadySubject =
    new BehaviorSubject<boolean>(false);

  authReady$ =
    this.authReadySubject.asObservable();


  constructor() {

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {

        const userData =
          await this.fetchUserData(user.uid);

        this.currentUserSubject.next(userData);

      } else {

        this.currentUserSubject.next(null);
      }

      this.authReadySubject.next(true);
    });
  }


  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<void> {

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = credential.user;

    const newUser: UserData = {
      uid: user.uid,
      name,
      email,
      role: 'user'
    };

    await setDoc(
      doc(db, 'users', user.uid),
      newUser
    );

    this.currentUserSubject.next(newUser);
  }


  async login(
    email: string,
    password: string
  ): Promise<UserData | null> {

    const credential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const userData =
      await this.fetchUserData(credential.user.uid);

    this.currentUserSubject.next(userData);

    console.log(auth.currentUser);

    return userData;
  }


  async logout(): Promise<void> {

    await signOut(auth);

    this.currentUserSubject.next(null);
  }

  

  private async fetchUserData(
    uid: string
  ): Promise<UserData | null> {

    const userDoc =
      await getDoc(doc(db, 'users', uid));

    if (userDoc.exists()) {

      return userDoc.data() as UserData;

    }

    return null;
  }


  isAdmin(): boolean {

    return this.currentUserSubject.value?.role === 'admin';
  }


  isLoggedIn(): boolean {

    return this.currentUserSubject.value !== null;
  }
}