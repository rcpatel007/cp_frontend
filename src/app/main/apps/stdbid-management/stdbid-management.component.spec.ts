import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdbidManagementComponent } from './stdbid-management.component';

describe('StdbidManagementComponent', () => {
  let component: StdbidManagementComponent;
  let fixture: ComponentFixture<StdbidManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdbidManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdbidManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
