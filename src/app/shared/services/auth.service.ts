import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of, switchMap } from 'rxjs';
import {
  Auth,
  authState,
  User as FireUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthFirestoreService } from './auth-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _snackBar = inject(MatSnackBar);
  private readonly storageKey = 'login';
  user$: Observable<FireUser | null>;
  loggedInUser$!: Observable<User | null>;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private authFireStoreService: AuthFirestoreService
  ) {
    this.user$ = authState(this.auth);
    this.setLogedInUser();
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (userCredential.user) {
      sessionStorage.setItem(this.storageKey, userCredential.user.uid);
    }

    this.setLogedInUser();

    return userCredential;
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
    userData: Partial<User>
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await this.createUserData(userCredential.user.uid, {
        ...userData,
        email: email,
      });

      return userCredential;
    } catch (error) {
      console.error('An error has occoured during registration:', error);
      throw error;
    }
  }

  private async createUserData(
    userId: string,
    userData: Partial<User>
  ): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), userId);

    return setDoc(userRef, userData);
  }

  async logout() {
    sessionStorage.removeItem(this.storageKey);
    await this.auth.signOut();
    //await clearIndexedDbPersistence(this.firestore);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  setLogedInUser(): void {
    this.loggedInUser$ = this.user$.pipe(
      switchMap((user) => {
        if (user) {
          return this.authFireStoreService.getUser(user.uid);
        }
        return of(null);
      })
    );
  }

  getLoggedInFireUser(): Observable<FireUser | null> {
    return this.user$;
  }

  getLoggedInUser(): Observable<User | null> {
    return this.loggedInUser$;
  }
}
