import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCarreraComponent } from './top-carrera.component';

describe('TopCarreraComponent', () => {
  let component: TopCarreraComponent;
  let fixture: ComponentFixture<TopCarreraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopCarreraComponent]
    });
    fixture = TestBed.createComponent(TopCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
