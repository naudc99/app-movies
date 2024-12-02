import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDirectorComponent } from './list-director.component';

describe('ListDirectorComponent', () => {
  let component: ListDirectorComponent;
  let fixture: ComponentFixture<ListDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
