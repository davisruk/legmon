import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersStatusPageComponent } from './servers-status-page.component';

describe('ServersStatusPageComponent', () => {
  let component: ServersStatusPageComponent;
  let fixture: ComponentFixture<ServersStatusPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServersStatusPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServersStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
