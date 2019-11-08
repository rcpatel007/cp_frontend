import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersFirstCounterManagementComponent } from './owners-first-counter-management.component';

describe('OwnersFirstCounterManagementComponent', () => {
  let component: OwnersFirstCounterManagementComponent;
  let fixture: ComponentFixture<OwnersFirstCounterManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnersFirstCounterManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnersFirstCounterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
