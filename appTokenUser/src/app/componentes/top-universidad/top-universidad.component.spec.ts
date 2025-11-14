import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUniversidadComponent } from './top-universidad.component';

describe('TopUniversidadComponent', () => {
  let component: TopUniversidadComponent;
  let fixture: ComponentFixture<TopUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopUniversidadComponent]
    });
    fixture = TestBed.createComponent(TopUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
