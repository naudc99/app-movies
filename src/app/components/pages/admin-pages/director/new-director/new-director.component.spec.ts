import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDirectorComponent } from './new-director.component';

describe('NewDirectorComponent', () => {
  let component: NewDirectorComponent;
  let fixture: ComponentFixture<NewDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
