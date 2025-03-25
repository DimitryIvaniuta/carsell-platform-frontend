import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for AuthService and Router
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'getToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the testing module using standalone component import
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should display navigation toolbar when token exists', () => {
    // Simulate authenticated user by returning a non-null token.
    authServiceSpy.getToken.and.returnValue('dummy-token');
    fixture.detectChanges();

    // Look for the toolbar element.
    const toolbarElem = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbarElem).toBeTruthy();
  });

  it('should not display navigation toolbar when token does not exist', () => {
    // Simulate not authenticated: getToken returns null.
    authServiceSpy.getToken.and.returnValue(null);
    fixture.detectChanges();

    // Verify that no toolbar is rendered.
    const toolbarElem = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbarElem).toBeNull();
  });

  it('should call logout and navigate to login on logout button click', () => {
    // Simulate authenticated state so toolbar (and logout button) are visible.
    authServiceSpy.getToken.and.returnValue('dummy-token');
    fixture.detectChanges();

    // Find the logout button.
    const logoutButton = fixture.debugElement.query(By.css('button'));
    logoutButton.triggerEventHandler('click', null);

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
