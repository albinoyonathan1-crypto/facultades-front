import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGeneralComponent } from './chat-general.component';

describe('ChatGeneralComponent', () => {
  let component: ChatGeneralComponent;
  let fixture: ComponentFixture<ChatGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatGeneralComponent]
    });
    fixture = TestBed.createComponent(ChatGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
