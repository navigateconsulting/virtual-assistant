import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketIoComponent } from './socket-io.component';

describe('SocketIoComponent', () => {
  let component: SocketIoComponent;
  let fixture: ComponentFixture<SocketIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
