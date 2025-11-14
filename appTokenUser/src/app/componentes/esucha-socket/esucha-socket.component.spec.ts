import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsuchaSocketComponent } from './esucha-socket.component';

describe('EsuchaSocketComponent', () => {
  let component: EsuchaSocketComponent;
  let fixture: ComponentFixture<EsuchaSocketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsuchaSocketComponent]
    });
    fixture = TestBed.createComponent(EsuchaSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
