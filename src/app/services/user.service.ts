import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import * as firebase from 'firebase';
import { Constants} from '../shared/constants';
import notify from 'devextreme/ui/notify';

@Injectable()
export class UserService implements CanActivate {
    userLoggedIn: boolean = false;
    loggedInUser: string;
    authUser: any;

    constructor( private router: Router ) {
        firebase.initializeApp({
            apiKey: "AIzaSyAVquI7vl07S-F5bVZ8yvB_Zexwb-4MFHI",
            authDomain: "orion-4fd7d.firebaseapp.com",
            databaseURL: "https://orion-4fd7d.firebaseio.com",
            projectId: "orion-4fd7d",
            storageBucket: "orion-4fd7d.appspot.com",
            messagingSenderId: "944532892683"
          })
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url: string): boolean {
        if (this.userLoggedIn) { return true; }

        this.router.navigate(['/login']);
        return false;
    }

    register(email: string, password: string){
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {                
                notify(`${error.message} Please Try Again!`,"Error",2000);
        });
    }

    verifyUser() {
        this.authUser = firebase.auth().currentUser;
        if (this.authUser) {

            console.log(`Welcome ${this.authUser.email}`);
            this.loggedInUser = this.authUser.email;
            this.userLoggedIn = true;
            this.router.navigate(['/myDashboards']);
        }
    }
   
    ensureUserRoots(){
        //debugger;
        this.authUser = firebase.auth().currentUser;
        if (this.authUser) {
            //check users/{key}
            let userRef = firebase.database().ref('users/').child(this.authUser.uid);
                      
            userRef.once('value')
            .then((snapshot)=> {
                var exists = (snapshot.val() !== null);
                if (!exists){
                    userRef.set({'name':this.authUser.email});
                    console.log('creating users root  ') ;
                }                     
            });          
        }
    }

    login(loginEmail: string, loginPassword: string) {
        firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
            .catch(function(error) {                
                notify(`${error.message} Unable to login. Try again!`,"Error",2000);
        });
    }

    logout(){
        this.userLoggedIn = false;
        var that = this;
        firebase.auth().signOut().then(function() {
            notify(`Logged Out!`,"Info", 2000);    
                
            that.router.navigate(['/']);
            that.userLoggedIn=false;
            that.loggedInUser=null;
        }, function(error) {            
            notify(`${error.message} Unable to logout. Try again!`,"Error",2000);
        });
    }
    getUsersRef():firebase.database.Reference{
        //let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.USERS_REF);//.child(userKey);
        return userObjRef;
    }
    getAllUsers(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUsersRef()        
        //todo: caching -> return local copy       
        dbRef.on('value', callback);   
    }

    
    

}
