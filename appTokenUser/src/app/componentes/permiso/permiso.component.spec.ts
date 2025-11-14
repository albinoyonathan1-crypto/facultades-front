import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoComponent } from './permiso.component';

describe('PermisoComponent', () => {
  let component: PermisoComponent;
  let fixture: ComponentFixture<PermisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermisoComponent]
    });
    fixture = TestBed.createComponent(PermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
