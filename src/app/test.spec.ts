import * as firebase from 'firebase';
import { UserService } from './services/user.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DependencyExp } from './models/dependencyexp';

describe('login with invalid password',()=>{
    let userSVC: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [UserService ],
        imports: [RouterTestingModule],
        });
        userSVC = TestBed.get(UserService);
    });
   
    it('should not work', inject([UserService], (svc: UserService) => {      
        console.info('svc: ' +userSVC);          
        userSVC.login('a@b.com', ''); //ennek egy fixturebol kene jonnie!      
        console.info('user: ' + userSVC.authUser);
        expect( userSVC.authUser).toBeUndefined();
       }));
}); 


describe('check DependenyExp class',()=>{
    it('should work', ()=>{
        var filter:any = [];
        filter['@fromDate']=new Date(2018,4,2);
        filter['@toDate']=new Date(2018,4,30);
        var de = new DependencyExp('{Date} ge @fromDate and {Date} le @toDate', filter);
        var row = {};
        row['Date']=new Date(2018,4,9);
        console.info('raw data: ' + row['Date']);
        var res = de.isMatch(row);

        expect(res).toBe(true);
    })
}); 


describe('download a.jpg',()=>{
    it('should work', ()=>{
        expect(true).toBe(true);
    })
});

describe('create dashboard on Firebase: dash1',()=>{
    it('should work', ()=>{
        expect(true).toBe(true);
    })
});
describe('rename dash1 to dash2',()=>{
    it('should work', ()=>{
        expect(true).toBe(true);
    })
});

/*

 beforeEach(async(() => {
        TestBed.configureTestingModule({   
          imports: [RouterTestingModule],             
          providers: [UserService]
        }).compileComponents();
      }));*/