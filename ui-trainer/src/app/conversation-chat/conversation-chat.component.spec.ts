import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationChatComponent } from './conversation-chat.component';

describe('ConversationChatComponent', () => {
  let component: ConversationChatComponent;
  let fixture: ComponentFixture<ConversationChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
